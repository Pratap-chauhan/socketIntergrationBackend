import { Application } from 'express';

import StarkFlowController from '../controllers/StarkFlowController';
import AuthService from '../services/AuthService';

export default class StarkFlowRoutes {

  static init(app: Application) {
    app.get('/sf/data', AuthService.isAuthenticated(), AuthService.isAdmin, StarkFlowController.data);

    app.post('/sf/wizard', StarkFlowController.wizard);
    app.post('/sf/custom', StarkFlowController.custom);
    app.post('/sf/contact', StarkFlowController.contact);
	}
}