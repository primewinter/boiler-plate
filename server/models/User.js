const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const dev = require('../config/dev');

const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        maxlength: 50
    },
    id: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type:String,
    },
    tokenExp: {
        tupe: Number
    }
})

userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')) {
        //비밀번호를 암호화시킨다
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }


})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567 암호화된비밀번호 $2b$10$V8KzRE7KtULDrRnhAMJAP.pUdcrdrUju4F/L7Gd1ygD6M5ITgLQWG
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), dev.jwtToken)
    // user._id + jwtToken = token
    // ->
    // jwtToken -> user._id
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}


userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + '' = token;
    
    // 토큰을 decode 한다.
    jwt.verify(token, dev.jwtToken, function(err, decoded){
        // 유저아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        console.log('찾을 id',decoded, '/',token);
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema);
module.exports = {User}