const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const dev = require('../config/dev');
const { timeStamp } = require('console');

const chatSchema = mongoose.Schema({
    room_id: {
        type: String
    },
    sender_id: String,
    content: String,
    created_at: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    type: {
        type:Number,
        default: 0 // 0: 일반 메시지, 1: 시스템 메시지
    }
})


const Chat = mongoose.model('Chat', chatSchema);
module.exports = {Chat}