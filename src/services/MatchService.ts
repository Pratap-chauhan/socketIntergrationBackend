import Job from "../models/Job";
import User from "../models/User";

export default class MatchService {
  static async transformJob(job_id) {
    const job: any = await Job.findById(job_id);
    let processedJob = {
      job_id: job._id,
      user_id: job.user,
      type: "job",
      domains: [],
      modules: []
    };

    job.skills
      ? job.skills.forEach(skillGroup => {
          processedJob[skillGroup.parent.toLowerCase()] = skillGroup.data.map(
            x => String(x._id)
          );
        })
      : [];

    job.domains
      ? job.domains.forEach(x => {
          processedJob.domains.push(String(x._id));
        })
      : [];

    job.modules
      ? job.modules.forEach(m => {
          processedJob.modules = processedJob.modules.concat(
            m.sub_modules.map(x => (x ? String(x._id) : null)).filter(x => x)
          );
        })
      : [];

    return processedJob;
  }

  static async transformUser(user_id) {
    const user: any = await User.findById(user_id);
    let transformedUser = {
      user_id: user._id,
      type: "candidate",
      domains: [],
      modules: []
    };

    user.skills
      ? user.skills.forEach(skillGroup => {
          transformedUser[skillGroup.parent.toLowerCase()] = skillGroup.data.map(
            x => String(x._id)
          );
        })
      : [];

    user.projects
      ? user.projects.forEach(p => {
        transformedUser.domains = transformedUser.domains.concat(
          p.domains.map(x => (x ? String(x._id) : null)).filter(x => x)
        );
      })
      : [];

    user.projects
      ? user.projects.forEach(p => {
          p.features.forEach(m => {
            transformedUser.modules = transformedUser.modules.concat(
              m.sub_modules.map(x => (x ? String(x._id) : null)).filter(x => x)
            );
          })
      })
      : [];

    return transformedUser;
  }
}
