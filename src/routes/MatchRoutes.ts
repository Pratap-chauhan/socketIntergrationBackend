import { Application } from 'express';

import MatchController from '../controllers/MatchController';
import AuthService from '../services/AuthService';

export default class MatchRoutes {

  static init(app: Application) {
    app.get(
      '/matches',
      AuthService.isAuthenticated(),
      MatchController.index
    );
	}
}