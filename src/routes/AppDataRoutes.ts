import { Application } from 'express';

import AppDataController from '../controllers/AppDataController';
import AuthService from '../services/AuthService';

export default class AuthRoutes {

  static init(app: Application) {
    // Get data
    app.get('/data/skills', AuthService.isAuthenticated(), AppDataController.skills);
    app.get('/data/designations', AuthService.isAuthenticated(), AppDataController.designations);
    app.get('/data/domains', AuthService.isAuthenticated(), AppDataController.domains);
    app.get('/data/features', AuthService.isAuthenticated(), AppDataController.domains);
  }
}