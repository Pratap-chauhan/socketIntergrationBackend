import MatchService from "../services/MatchService";
import ProcessedData from "../models/ProcessedData";
import Tracking from "./Tracking";
import Match from "../models/Match";

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
      // Delete Old
      await ProcessedData.deleteOne({
        user_id: processedUser.user_id,
        type: processedUser.type
      });
      await Match.deleteMany({job: processedUser.user_id});
      // Add New and Process
      await ProcessedData.create(processedUser);
      MatchService.processMatchesForCandidate(processedUser, () => {
        console.log(`Matches processed for candidate ${processedUser.user_id}`);
      });
    } catch (e) {
      Tracking.log({
        type: "transform.user",
        message: "User transform failed",
        data: e.message
      });
    }
  }
}
