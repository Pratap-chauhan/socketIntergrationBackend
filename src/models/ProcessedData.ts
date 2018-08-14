import * as mongoose from 'mongoose';

const processedData = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['job', 'candidate'],
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: () => this.type === 'job'
    }
  },
  {
    strict: false,
    timestamps: true,
    collection: 'processed_data'
  }
);

export default mongoose.model('ProcessedData', processedData);
