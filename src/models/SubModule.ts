import * as mongoose from 'mongoose';

const sub_module = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  module_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }
}, {
    versionKey: false,
    collection: 'sub_modules'
});

export default mongoose.model('SubModule', sub_module);