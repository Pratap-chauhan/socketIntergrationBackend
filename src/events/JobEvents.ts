import MatchService from "../services/MatchService";
import ProcessedData from "../models/ProcessedData";
import Tracking from "./Tracking";
import Queue from "../services/Queue";

export class JobEvents {
  static created(job: any) {
    JobEvents.transformJob(job._id);
  }

  static updated(user: any) {
    JobEvents.transformJob(user._id);
  }

  private static async transformJob(job_id) {
    const processedJob = await MatchService.transformJob(job_id)
    try {
      const processedItem = await ProcessedData.create(processedJob);
      const queue = Queue.init();
      const job = queue
        .create("matchesForJob", processedItem)
        .priority("high")
        .attempts(5)
        .removeOnComplete(true)
        .save(error => {
          console.log({ error });
        });
      Queue.attachJobHandlers(job);
    } catch (e) {
      Tracking.log({
        type: "transform.job",
        message: "Job transform failed",
        data: e.message
      });
    }
  }
}
