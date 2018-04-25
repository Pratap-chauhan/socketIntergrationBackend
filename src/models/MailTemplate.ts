import * as mongoose from 'mongoose';

const template = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  subject: {type: String},
	path: {type: String, required: true},
  key: { type: String, unique: true, required: true },
  variables: [
    {
      name: String,
      replace: String,
      default: String
    }
  ],
  versions: Array
}, {
	timestamps: true,
});

export default mongoose.model('MailTemplate', template, 'email_templates');