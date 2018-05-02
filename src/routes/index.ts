import { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

import AuthRoutes from './AuthRoutes';
import AppDataRoutes from './AppDataRoutes';
import UserRoutes from './UserRoutes';

export default class Routes {

  static init(app: Application) {
		app.use(bodyParser.urlencoded({limit: '25mb', extended: false }));
		app.use(bodyParser.json({limit: '25mb'}));

    // Enable cors
    app.use(Routes.cors);

    // Initialize the routes
		AuthRoutes.init(app);
		AppDataRoutes.init(app);
		UserRoutes.init(app);

		// Catch all the mismatch routes
		app.get('/*', Routes.notFound);
		app.post('/*', Routes.notFound);
  }

  static cors (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, client-security-token, Origin, Content-Length, X-Requested-With');
    if ('OPTIONS' == req.method) {
      return res.send(200);
    } else {
      next();
    }
  }

  static notFound(req: Request, res: Response) {
    return res.status(404).json({
      error: true,
      message: 'This api does not exist'
    });
  }
}