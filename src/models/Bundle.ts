import * as mongoose from 'mongoose';

const bundle = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  platforms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Platform'
    }
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    }
  ],
  sub_modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubModule'
    }
  ]
}, {
	versionKey: false
});

export default mongoose.model('Bundle', bundle);