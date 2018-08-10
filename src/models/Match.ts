import * as mongoose from 'mongoose';

const match = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    score: {
      type: Object,
      required: true
    }
  },
  {
    strict: false,
    timestamps: true,
    collection: 'matches'
  }
);

export default mongoose.model('Match', match);
