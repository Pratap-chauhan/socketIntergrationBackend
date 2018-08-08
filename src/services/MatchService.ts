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
          processedJob[skillGroup.parent.toLowerCase()] = MatchService.getIds(
            skillGroup.data
          );
        })
      : [];

    job.domains
      ? (processedJob.domains = MatchService.getIds(job.domains))
      : [];

    job.modules
      ? job.modules.forEach(m => {
          processedJob.modules = processedJob.modules.concat(
            MatchService.getIds(m.sub_modules)
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
          transformedUser[
            skillGroup.parent.toLowerCase()
          ] = MatchService.getIds(skillGroup.data);
        })
      : [];

    user.projects
      ? user.projects.forEach(p => {
          transformedUser.domains = transformedUser.domains.concat(
            MatchService.getIds(p.domains)
          );
        })
      : [];

    user.projects
      ? user.projects.forEach(p => {
          p.features.forEach(m => {
            transformedUser.modules = transformedUser.modules.concat(
              MatchService.getIds(m.sub_modules)
            );
          });
        })
      : [];

    return transformedUser;
  }

  static getIds(data: any[]) {
    return data.map(x => (x && x._id ? String(x._id) : null)).filter(x => x);
  }
}
