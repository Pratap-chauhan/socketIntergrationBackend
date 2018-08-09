import { Application } from 'express';

import JobController from '../controllers/JobController';
import AuthService from '../services/AuthService';

export default class JobRoutes {

  static init(app: Application) {
    /**
     * @api {get} /jobs Job List
     * @apiName GetJobs
     * @apiGroup Job
     *
     * @apiParam {Number} per_page=20 Jobs to show per page.
     * @apiParam {Number} page=1 Page number.
     * @apiParam {String="asc", "desc"} sort_as="desc" Sort the jobs as.
     * @apiParam {String="createdAt", "updateAt", "title"} sort_by="createdAt" Sort job by.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Paginate and Jobs object.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *          "jobs": [
     *           {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *                "pictureUrl": "http://placehold.it/400x400"
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *            },
     *          ],
     *          "paginate": {
     *            "total_item": 25,
     *            "showing": 20,
     *            "first_page": 1,
     *            "previous_page": 1,
     *            "current_page": 1,
     *            "next_page": 2,
     *            "last_page": 2
     *          }
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get(
      '/jobs',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.index
    );

    /**
     * @api {post} /jobs Create a Job
     * @apiName CreateJob
     * @apiGroup Job
     *
     * @apiParamExample {json} Request-Example:
     *    {
     *      "skills": [
     *        {
     *          "_id": "5adf1ab90f17bdb02064b4b1",
     *          "title": "MongoDB"
     *        }
     *      ],
     *      "title": "Fullstack Developer - Second latest",
     *      "description": "Some random description for the job"
     *    }
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample ValidationFailed:
     *    HTTP/1.1 200 ValidationFailed
     *    {
     *      "error": true,
     *      "message": "Validation failed",
     *      "data": {
     *        "title": "Job title is required",
     *        "description": "Job description is required",
     *        "skills": "Job skills are required"
     *      }
     *    }
     *
     * @apiSuccessExample Job Created Successfully:
     *     HTTP/1.1 201 OK
     *     {
     *        "error":false,
     *        "message": "Job posted successfully.",
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *                "pictureUrl": "http://placehold.it/400x400"
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.post(
      '/jobs',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.create
    );

    /**
     * @api {get} /jobs/:id Get a Job
     * @apiName GetJob
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *                "pictureUrl": "http://placehold.it/400x400"
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError NotFoundError Job not found.
     * @apiErrorExample NotFoundError:
     *     HTTP/1.1 404 NotFoundError
     *     "Job not found."
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get(
      '/jobs/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.show
    );

    /**
     * @api {get} /jobs/:id Get a Job (Public)
     * @apiName GetJobPublic
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "user": {
     *                "_id": "5b015cfb1785db7a7651491e",
     *                "firstName": "My",
     *                "lastName": "Name",
     *              },
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError NotFoundError Job not found.
     * @apiErrorExample NotFoundError:
     *     HTTP/1.1 404 NotFoundError
     *     "Job not found."
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.get(
      '/jobs/:id/show',
      JobController.public
    );

    /**
     * @api {post} /jobs/:id Update a Job
     * @apiName UpdateJob
     * @apiGroup Job
     *
     * @apiParamExample {json} Request-Example:
     *    {
     *      "skills": [
     *        {
     *          "_id": "5adf1ab90f17bdb02064b4b1",
     *          "title": "MongoDB"
     *        }
     *      ],
     *      "title": "Fullstack Developer - Second latest",
     *      "description": "Some random description for the job"
     *    }
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     * @apiSuccess {Object} data  Job object.
     *
     * @apiSuccessExample ValidationFailed:
     *    HTTP/1.1 200 ValidationFailed
     *    {
     *      "error": true,
     *      "message": "Validation failed",
     *      "data": {
     *        "title": "Job title is required",
     *        "description": "Job description is required",
     *        "skills": "Job skills are required"
     *      }
     *    }
     *
     * @apiSuccessExample Job Created Successfully:
     *     HTTP/1.1 201 OK
     *     {
     *        "error":false,
     *        "message": "Job updated successfully.",
     *        "data": {
     *              "skills": [
     *                {
     *                  "_id": "5adf1ab90f17bdb02064b4b1",
     *                  "title": "MongoDB"
     *                }
     *              ],
     *              "_id": "5b0bda44271c78261b4aba77",
     *              "title": "Fullstack Developer Latest",
     *              "description": "Some random description for the job",
     *              "createdAt": "2018-05-28T10:30:28.009Z",
     *              "updatedAt": "2018-05-28T10:30:28.009Z",
     *              "__v": 0
     *        }
     *    }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError NotFoundError Job not found.
     * @apiErrorExample NotFoundError:
     *     HTTP/1.1 404 NotFoundError
     *     "Job not found."
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.put(
      '/jobs/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.update
    );

    /**
     * @api {put} /jobs/:id Archive a Job
     * @apiName ArchiveJob
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "message": "Job archived successfully."
     *     }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.put(
      '/jobs/:id/archive',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.archive
    );

    /**
     * @api {delete} /jobs/:id Delete a Job
     * @apiName DeleteJob
     * @apiGroup Job
     *
     * @apiParam {String} id ID of the Job.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {String} message Message.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "message": "Job deleted successfully."
     *     }
     *
     * @apiError UnauthorizedError Authorization error on server.
     * @apiErrorExample UnauthorizedError:
     *     HTTP/1.1 401 UnauthorizedError
     *     "Unauthorized"
     *
     * @apiError ServerError Unexpected error on server.
     * @apiErrorExample ServerError:
     *     HTTP/1.1 500 ServerError
     *     "An error occured"
     */
    app.delete(
      '/jobs/:id',
      AuthService.isAuthenticated(),
      AuthService.hasRole(['admin', 'hr']),
      JobController.destroy
    );
  }
}