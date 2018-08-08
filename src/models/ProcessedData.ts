import * as mongoose from 'mongoose';

const processedData = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['job', 'candidate'],
      required: true
    },
    user_id: {
      type: String,
      required: true
    },
    job_id: {
      type: String,
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
