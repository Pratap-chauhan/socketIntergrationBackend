import * as mongoose from 'mongoose';

const user = new mongoose.Schema({
	id: {type: String, required: true, index: true},
	name: {type: String},
	email: {type: String, index: true},
	company: {type: String},
  ghCreated: {type: Date},
  avatar: {type: String},
  login: {type: String},
  approved: { type: Boolean, default: 1 },
  role: {
    type: String,
    enum: ['admin', 'hr', 'user'],
    default: 'user'
  },
  onboarding: { type: Boolean, default: true },
  skills: { type: [], default: [] },
  designation: { type: {}, default: {} },
  can_edit: {
    name: false,
    email: false,
  },
  projects: {
    type: [],
    default: []
  },
  last_logged_in: { type: Date, default: new Date() },
  password: { type: String },
}, {
  strict: false,
	timestamps: true
});

export default mongoose.model('User', user);