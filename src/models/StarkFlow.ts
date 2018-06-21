import * as mongoose from 'mongoose';

const sf = new mongoose.Schema({
  type: {
    type: String,
    enum: ['contact', 'wizard', 'custom']
  }
}, {
  versionKey: false,
  strict: false,
  collection: 'starkflow',
  timestamps: true
});

export default mongoose.model('StarkFlow', sf);