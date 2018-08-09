import * as mongoose from 'mongoose';

const job = new mongoose.Schema({
  user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
  title: {
    type: String
  },
  skills: {
    type: [],
    default: []
  },
  modules: {
    type: [],
    default: []
  },
  domains: {
    type: [],
    default: []
  },
  designation: {
    type: String
  },
  archived: {
    type: Boolean,
    default: false
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  strict: false,
	timestamps: true
});

export default mongoose.model('Job', job);