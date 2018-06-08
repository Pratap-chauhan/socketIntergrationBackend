import { Application } from 'express';

import StarkFlowController from '../controllers/StarkFlowController';

export default class StarkFlowRoutes {

  static init(app: Application) {
    app.post('/sf/wizard', StarkFlowController.wizard);
    app.post('/sf/custom', StarkFlowController.custom);
    app.post('/sf/contact', StarkFlowController.contact);
	}
}