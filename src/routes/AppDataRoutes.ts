import { Application } from 'express';

import AppDataController from '../controllers/AppDataController';

export default class AuthRoutes {

  static init(app: Application) {
    // Get data
    app.get('/data/skills', AppDataController.skills);
    app.get('/data/designations', AppDataController.designations);
	}
}