import * as mongoose from 'mongoose';

const message = new mongoose.Schema({
	text: {
		type: String,
		required: true
  },
	from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
	to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  data: Object,
  seen: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
  collection: 'messages'
});

export default mongoose.model('Message', message);