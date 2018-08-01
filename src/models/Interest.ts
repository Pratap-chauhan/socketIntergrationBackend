import * as mongoose from 'mongoose';

const interest = new mongoose.Schema({
	job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
	from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'interests'
});

export default mongoose.model('Interest', interest);