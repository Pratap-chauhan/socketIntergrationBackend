import { Application } from 'express';

import AuthController from '../controllers/AuthController';

export default class AuthRoutes {

  static init(app: Application) {
    // Register/Login a user
    app.post('/sessions/create', AuthController.login);
    // Logout a user
    app.post('/sessions/destroy', AuthController.logout);

    app.post('/sf/login', AuthController.adminLogin);
	}
}