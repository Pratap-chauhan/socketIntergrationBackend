import { Application } from 'express';

import AuthService from '../services/AuthService';
import ProfileController from '../controllers/ProfileController';

export default class AuthRoutes {

  static init(app: Application) {
    // Get data
    app.get('/users/me', AuthService.isAuthenticated(), ProfileController.me);
    app.get('/users/me/onboarding', AuthService.isAuthenticated(), ProfileController.onboarding);
    app.put('/users', AuthService.isAuthenticated(), ProfileController.update);
	}
}