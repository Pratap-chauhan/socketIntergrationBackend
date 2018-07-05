import * as mongoose from 'mongoose';

const company = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  logo: {
    type: String
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
    versionKey: true,
    timestamps: true
});

export default mongoose.model('Company', company);