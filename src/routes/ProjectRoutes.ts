import { Application } from 'express';
import AuthService from "../services/AuthService";
import   projectController from '../controllers/projectController';


export default class ProjectRoutes {

  static init(app: Application) {

    app.post(
      '/images_upload',
      projectController.uploadImages
    );
   app.get('/getImage' , projectController.get);
  }
}