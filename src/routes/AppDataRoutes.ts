import { Application } from 'express';

import AppDataController from '../controllers/AppDataController';

export default class AuthRoutes {

  static init(app: Application) {
    /**
     * @api {get} /data/skills Skills
     * @apiName GetSkills
     * @apiGroup AppData
     *
     * @apiParam {String} q Search skill.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of skills.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *            "_id":"5adf1ab90f17bdb02064b4bb",
     *            "title":"Node.JS",
     *            "parent":"Tools/Platforms/Apis"
     *          }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/skills', AppDataController.skills);

    /**
     * @api {get} /data/designations Get designations
     * @apiName GetDesignations
     * @apiGroup AppData
     *
     * @apiParam {String} q Designations.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of designations.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *            "_id":"5adf1ab90f17bdb02064b4bb",
     *            "title":"Backend Developer",
     *          }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/designations', AppDataController.designations);

    /**
     * @api {get} /data/domains Domains
     * @apiName GetDomains
     * @apiGroup AppData
     *
     * @apiParam {String} q Search domains.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of domains.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *            "_id":"5adf1ab90f17bdb02064b4bb",
     *            "title":"Market Research",
     *          }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/domains', AppDataController.domains);

    /**
     * @api {get} /data/features Features
     * @apiName GetFeatures
     * @apiGroup AppData
     *
     * @apiParam {String} q Search features.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Array} data  List of features.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data":[
     *          {
     *            "_id":"5adf1ab90f17bdb02064b4bb",
     *            "title":"Dashboard",
     *          }
     *        ]
     *    }
     *
     * @apiError ServerError Unexpected error on server.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get('/data/features', AppDataController.domains);
    app.get('/data/bundles', AppDataController.bundles);
    app.get('/data/modules', AppDataController.modules);
    app.get('/data/sf', AppDataController.initalDataSF);
  }
}