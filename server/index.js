const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const { Room } = require('./models/Room');
const { Chat } = require('./models/Chat');
const { auth } = require('./middleware/auth');
const SocketEvents = require('./socket/socket');
const config = require('./config/key');
const server = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

const cors_origin = [`http://localhost:3000`];

app.use(cookieParser());
//app cors
app.use(cors({
  origin: cors_origin, // 허락하고자 하는 요청 주소
  credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
}))
//application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//application/json
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err=> console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! hihihihihih ㅋㅋㅋ')
})

app.get('/api/hello', (req, res)=> {
  res.send("안녕하세요 *^^*");
})

app.post('/api/user/register', (req,res)=> {
  console.log('register...')
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)
  user.save((err, userInfo) => {
    console.log('save...',err,userInfo);
    if(err) return res.json({success:false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/api/user/login', (req, res) => {
  console.log('login...', req.body.id);
  // 요청된 아이디를 데이터베이스에서 있는지 조회
  User.findOne({ id: req.body.id }, (err, user)=>{
    console.log('findOne',user);
    if(err) return res.status(400).send(err);
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "해당하는 유저가 없습니다."
      })
    }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err,isMatch)=>{
      if(!isMatch)
      return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
    })
    // 비밀번호까지 맞다면 토큰 생성
    user.generateToken((err,user) => {
      if(err) return res.status(400).send(err);
      console.log('token생성?',err, user.token);

      // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 ..(작동 안 됨)
      res.cookie("x_auth", user.token, {
        httpOnly: true, maxAge: 900000
      })
        .status(200)
        .send({ loginSuccess: true, userId: user._id});
//        .json({ loginSuccess: true, userId: user._id})
      
    })
  })
})

app.get('/api/room/list', (req, res) => {
  console.log('list...');
  Room.find((err, room)=>{
    if(err) return res.status(400).send(err);
    res.status(200).send(room);
  })
})

app.post('/api/room/create', (req,res)=> {
  console.log('create...')

  const room = new Room(req.body)
  room.save((err, roomInfo) => {
    console.log('room save...',err,roomInfo);
    if(err) return res.json({success:false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/api/room/join', (req,res)=> {
  console.log('join...')
  console.log(req.body.room_id)

  Chat.find({room_id:req.body.room_id},(err, chats) => {
    console.log('room find...', req.body.room_id);
    if(err) return res.json({success:false, err})
    return res.status(200).json(chats)
  });
  
})

//Auth Router
// role ==  0 -> 일반유저 , role != 0 -> 관리자
app.get('/api/user/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 뜻
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    id: req.user.id,
    nickname: req.user.nickname,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

// logout Router
app.get('/api/user/logout', auth, (req, res)=>{
  User.findOneAndUpdate({_id: req.user._id}, 
    { token: "" }
    , (err, user)=> {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success:true
      })
    })
})

const port = 5000

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

io.sockets.on('connection', (socket)=>{
  console.log('user connection...');
  socket.on('send', (data)=>{
    console.log('전달된 메시지: '+data.msg);
  })

  socket.on('disconnect', ()=>{
    console.log('접속 종료');
  })
});