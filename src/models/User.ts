import * as mongoose from 'mongoose';

const user = new mongoose.Schema({
	id: {type: String, required: true, index: true},
	name: {type: String, required: true},
	email: {type: String, index: true},
	company: {type: String},
  ghCreated: {type: Date},
  login: {type: String},
	approved: {type: Boolean, default: 1},
	reset_token: String,
	reset_token_expiry: Number,
}, {
  strict: false,
	timestamps: true
});

export default mongoose.model('User', user);