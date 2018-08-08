import MatchService from "../services/MatchService";
import ProcessedData from "../models/ProcessedData";
import Tracking from "./Tracking";
import Queue from "../services/Queue";

export class UserEvents {
  static created(user: any) {
    UserEvents.transformUser(user._id);
  }

  static updated(user: any) {
    UserEvents.transformUser(user._id);
  }

  private static async transformUser(user_id) {
    const processedUser = await MatchService.transformUser(user_id);
    try {
      const processedItem = await ProcessedData.create(processedUser);
      const queue = Queue.init();
      const job = queue
        .create("matchesForCandidate", processedItem)
        .priority("high")
        .attempts(5)
        .removeOnComplete(true)
        .save(error => {
          console.log({ error });
        });
      Queue.attachJobHandlers(job);
    } catch (e) {
      Tracking.log({
        type: "transform.user",
        message: "User transform failed",
        data: e.message
      });
    }
  }
}
