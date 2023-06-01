const { string, object } = require("joi");
const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true},
    mobile: {type: String, required: true},
    otp: {type: Object, default: {code: 0, expireIn: 0}},
    email: {type: String, lowercase: true},
    password: {type: String}
}, {
    timestamps: true
});

module.exports = {
    UserModel: mongoose.model("user", UserSchema)
};