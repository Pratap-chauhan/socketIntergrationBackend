import * as mongoose from 'mongoose';

const appData = new mongoose.Schema({
	title: {
		type: String,
		required: true
  },
	type: {
    type: String,
    required: true
  },
	parent: {
    type: String
  },
  desc: {
    type: String
  },
  avatar: {
    type: String
  },
  data: Object,
}, {
  timestamps: true,
  collection: 'app_data'
});

export default mongoose.model('AppData', appData);