import { Application } from 'express';

import JobController from '../controllers/JobController';
import AuthService from '../services/AuthService';

export default class JobRoutes {

  static init(app: Application) {
    app.get('/jobs', AuthService.isAuthenticated(), JobController.index);
    app.post('/jobs', AuthService.isAuthenticated(), JobController.create);
    app.get('/jobs/:id', AuthService.isAuthenticated(), JobController.show);
    app.put('/jobs/:id', AuthService.isAuthenticated(), JobController.update);
    app.delete('/jobs/:id', AuthService.isAuthenticated(), JobController.destroy);
  }
}