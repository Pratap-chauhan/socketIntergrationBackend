import { Application } from 'express';

import InterestController from '../controllers/InterestController';
import AuthService from '../services/AuthService';

export default class InterestRoutes {

  static init(app: Application) {

    app.post(
      '/jobs/:jobId/interests',
      AuthService.isAuthenticated(),
      InterestController.create
    );

    app.delete(
      '/interests/:interestid',
      AuthService.isAuthenticated(),
      InterestController.destroy
    )
  }
}