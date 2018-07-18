import { Application } from 'express';

import CompanyController from '../controllers/CompanyController';
import AuthService from '../services/AuthService';

export default class CompanyRoutes {

  static init(app: Application) {
    app.get(
      '/companies',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.index
    );

    app.post(
      '/companies',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.create
    );

    app.get(
      '/companies/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.show
    );

    app.put(
      '/companies/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['hr', 'admin']),
      CompanyController.update
    );
	}
}