const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true

        }
    }]
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    
    return _.pick(userObject, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = "auth";
    let token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => token);
}

userSchema.statics.findByToken = function (token) {
    let User = this;
    let decode;
    try {
        decoded = jwt.verify(token, "abc123");
    } catch(e){
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

userSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(20)
        .then(salt => {
            return bcrypt.hash(user.password, salt);            
        })
        .then(hash => {
            user.password = hash;
            next();
        })
    } else {
        next();
    } 
    
})

const User = mongoose.model('User', userSchema);

module.exports = { User }