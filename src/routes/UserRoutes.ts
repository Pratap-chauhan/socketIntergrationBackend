import { Application } from 'express';

import AuthService from '../services/AuthService';
import UserController from '../controllers/UserController';

export default class AuthRoutes {

  static init(app: Application) {
    // Get data
    app.get('/users/me', AuthService.isAuthenticated(), UserController.me);
    app.get('/users/me/login-data', AuthService.isAuthenticated(), UserController.myLoginData);
    app.get('/users/me/onboarding', AuthService.isAuthenticated(), UserController.onboarding);
    app.put('/users', AuthService.isAuthenticated(), UserController.update);
	}
}