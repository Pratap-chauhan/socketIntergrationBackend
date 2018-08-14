import MatchService from "../services/MatchService";
import ProcessedData from "../models/ProcessedData";
import Tracking from "./Tracking";
import Match from "../models/Match";
import { Types } from "mongoose";

export class JobEvents {
  static created(job: any) {
    JobEvents.transformJob(job._id);
  }

  static updated(job: any) {
    JobEvents.transformJob(job._id);
  }

  private static async transformJob(job_id) {
    const processedJob = await MatchService.transformJob(job_id);
    try {
      // Delete Old
      await ProcessedData.deleteOne({
        user_id: processedJob.user_id,
        type: processedJob.type,
        job_id: processedJob.job_id
      });
      await Match.deleteMany({job: processedJob.job_id});
      // Add New and Process
      await ProcessedData.create(processedJob);
      MatchService.processMatchesForJob(processedJob, () => {
        console.log(`Matches processed for job ${processedJob.job_id}`);
      });
    } catch (e) {
      Tracking.log({
        type: "transform.job",
        message: "Job transform failed",
        data: e.message
      });
    }
  }
}
