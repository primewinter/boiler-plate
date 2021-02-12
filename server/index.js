const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');
const config = require('./config/key');

const cors_origin = [`http://localhost:3000`];

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
//app cors
app.use(cors({
  origin: cors_origin, // 허락하고자 하는 요청 주소
  credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.

}))

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
  console.log('login...');
  // 요청된 이메일을 데이터베이스에서 있는지 조회
  User.findOne({ email: req.body.email }, (err, user)=>{
    if(err) return res.status(400).send(err);
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
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

      // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 ..
      res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id})
    })
  })
})



//Auth Router
// role ==  0 -> 일반유저 , role != 0 -> 관리자
app.get('/api/user/auth', auth , (req, res) => {

  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 뜻
  req.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})