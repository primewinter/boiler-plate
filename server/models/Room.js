const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const dev = require('../config/dev');
const { timeStamp } = require('console');

const roomSchema = mongoose.Schema({
    title: {
        type: String,
        maxlength: 50
    },
    password: {
        type: String
    },
    created_at: {
        type: Date
    },
    deleted: {
        type: Boolean,
        default: false
    },
    image: String,
    admin: Array,
    members: Array,
    blocked: Array
})

roomSchema.pre('save', function(next){
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

roomSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567 암호화된비밀번호 $2b$10$V8KzRE7KtULDrRnhAMJAP.pUdcrdrUju4F/L7Gd1ygD6M5ITgLQWG
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

roomSchema.statics.findByTitle = function(title, cb) {
    var room = this;
    // user._id + '' = token;
    
    room.findList({"title": title}, function(err, room){
        if(err) return cb(err);
        cb(null, room);
    })
}


const Room = mongoose.model('Room', roomSchema);
module.exports = {Room}