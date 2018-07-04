import * as mongoose from 'mongoose';

const file = new mongoose.Schema({
	addedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	contentType: String,
	type: String,
	entity: String,
	name: String,
  key: {
    type: String,
    unique: true
  }
}, {
  timestamps: true,
  versionKey: false
});


export default mongoose.model('File', file);