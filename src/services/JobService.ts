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

  static processJobForMatch(job) {
    let processedJob = {
      job_id: job._id,
      user_id: job.user,
      type: 'job',
      matches: [],
      hidden_matches: [],
      ignored_matches: [],
      domains: [],
      modules: []
    };

    job.skills ? job.skills.forEach(skillGroup => {
      processedJob[skillGroup.parent.toLowerCase()] = skillGroup.data.map(x => String(x._id));
    }) : [];

    job.domains ? job.domains.forEach(x => {
      processedJob.domains.push(String(x._id));
    }) : [];

    job.modules ? job.modules.forEach(m => {
      processedJob.modules = processedJob.modules.concat(m.sub_modules.map(x => (x ? String(x._id) : null)).filter(x => x));
    }) : [];

    return processedJob;
  }
}
