import * as mongoose from 'mongoose';

const platform = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
}, {
	versionKey: false
});

export default mongoose.model('Platform', platform);