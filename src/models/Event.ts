import * as mongoose from 'mongoose';

const event = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
	versionKey: false
});

export default mongoose.model('Event', event);