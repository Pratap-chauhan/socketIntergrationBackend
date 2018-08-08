export default class JobService {
  static validate(data) {
    const errors = {};

    if (!data.title) {
      errors["title"] = "Job title is required";
    }

    if (!data.description) {
      errors["description"] = "Job description is required";
    }

    if (!data.skills || data.skills.length === 0) {
      errors["skills"] = "Job skills are required";
    }
    return Object.keys(errors).length > 0 ? errors : false;
  }
}
