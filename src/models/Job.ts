import * as mongoose from 'mongoose';

const job = new mongoose.Schema({
  user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  title: { type: String },
  skills: { type: [], default: [] },
  designation: { type: {}, default: {} },
}, {
  strict: false,
	timestamps: true
});

export default mongoose.model('Job', job);