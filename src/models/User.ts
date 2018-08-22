import * as mongoose from 'mongoose';

const user = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
      description: 'ID of the user'
    },
    name: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    emailAddress: {
      type: String
    },
    email: {
      type: String,
      index: true
    },
    company: {
      type: String,
      description: 'Company of the user - From GH for candidates and for HRs from LI'
    },
    ghCreated: {
      type: Date,
      description: 'Github created at field for the user.'
    },
    avatar: {
      type: String
    },
    login: {
      type: String
    },
    approved: {
      type: Boolean,
      default: 1
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'candidate'],
      default: 'candidate'
    },
    onboarding: {
      type: Boolean,
      default: true,
      description:
        'If the user has to go through the on boarding process. Helpful when user has created account and run away'
    },
    skills: {
      type: [],
      default: []
    },
    designation: {
      type: String
    },
    can_edit: {
      name: false,
      email: false
    },
    projects: {
      type: [],
      default: []
    },
    last_logged_in: {
      type: Date,
      default: new Date()
    },
    password: {
      type: String
    },
    experience_role: {
      type: String
    },
    looking_for: {
      type: String
    },
    availability: {
      type: String
    },
    salary: {
      type: Object
    },
    locations: {
      type: Array
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    image_url : {
      type: Array
    }
  },
  {
    strict: false,
    timestamps: true
  }
);

export default mongoose.model('User', user);
