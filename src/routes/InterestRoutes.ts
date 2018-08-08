import { Application } from 'express';

import InterestController from '../controllers/InterestController';
import AuthService from '../services/AuthService';

export default class InterestRoutes {

  static init(app: Application) {

    app.post(
      '/interests',
      AuthService.isAuthenticated(),
      InterestController.toggle
    );

    app.post(
      '/interests/can-apply',
      AuthService.isAuthenticated(),
      InterestController.canApply
    );
  }
}