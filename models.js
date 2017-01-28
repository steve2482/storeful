const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	userName: {type: String, required: true},
	password: {type: String, required: true},
	items: []
});

const User = mongoose.model('User', userSchema);

module.exports = {User};
