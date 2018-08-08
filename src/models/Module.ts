import * as mongoose from 'mongoose';

const mod = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model('Module', mod);
