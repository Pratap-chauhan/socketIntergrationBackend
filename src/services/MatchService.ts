import Job from "../models/Job";
import User from "../models/User";
import KPIScores from "../config/KPIScores";
import * as _ from "lodash";
import ProcessedData from "../models/ProcessedData";
import Match from "../models/Match";

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

  static processMatchesForJob(data, callback) {
    const job = data.job;
    const cursor = ProcessedData.find({ type: "candidate" }).cursor();
    cursor.eachAsync(async candidate => {
      candidate = candidate.toJSON();
      await MatchService.processJobAndCandidate(job, candidate);
    }, callback);
  }

  static async processMatchesForCandidate(data, callback) {
    const candidate = data.candidate;
    const cursor = ProcessedData.find({ type: "job" }).cursor();
    cursor.eachAsync(async job => {
      job = job.toJSON();
      await MatchService.processJobAndCandidate(job, candidate);
    }, callback);
  }

  static async processJobAndCandidate(job, candidate) {
    const scores: any = {
      total: 0
    };
    _.map(KPIScores, (item, name) => {
      if (job[name] && candidate[name]) {
        scores[name] = item.calc(job[name], candidate[name]);
        scores.total += scores[name];
      }
    });
    // Map the scores and round to 2
    for (var key in scores) {
      scores[key] = _.round(scores[key], 2);
    }

    const data = {
      hr: job.user_id,
      job: job._id,
      candidate: candidate._id,
      score: scores
    };

    await Match.findOneAndUpdate(
      { hr: data.hr, job: data.job, candidate: data.candidate },
      { $set: { score: data.score },
      { upsert: true }
    );
  }
}
