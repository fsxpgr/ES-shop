const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type:String, index:{unique:false}},
    phone: {type:String, index:{unique:false}},
    email: {type:String, required:true, unique: true},
    password: {type: String, required: true, index:{unique:false} },
    isAdmin: {type: Boolean},
    shoppingCart:[{}]
}) ;

userSchema.methods.verifyPassword = function(password){
    if(this.password === password){
        return true;
    }
    return false;
};

module.exports = mongoose.model('users',userSchema);