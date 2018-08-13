import { Application } from "express";

import MessageController from "../controllers/MessageController";
import AuthService from "../services/AuthService";

export default class MessageRoutes {
  static init(app: Application) {
    /**
     * @api {get} /messages Chats
     * @apiName Chats
     * @apiGroup Messages
     *
     * @apiParam {Number} page=1 Page number.
     * @apiParam {Number} limit=10 Results per page.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Messages.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": [
     *          {
     *            "text": "ookokokok",
     *            "createdAt": "2018-06-05T21:19:21.288Z",
     *            "other": {
     *                "_id": "5a8caf697f6c946b4d5c1d39",
     *                "name": "Some User"
     *            },
     *            "me": {
     *                "_id": "5a8caf697f6c946b4d5c1d36",
     *                "name": "Admin"
     *            },
     *            "position": "left"
     *          },
     *          {
     *              "text": "masd",
     *              "createdAt": "2018-06-05T21:19:06.671Z",
     *              "other": {
     *                  "_id": "5a8caf697f6c946b4d5c1d3a",
     *                  "name": "Other user"
     *              },
     *              "me": {
     *                  "_id": "5a8caf697f6c946b4d5c1d36",
     *                  "name": "Admin"
     *              }
     *          }
     *          "position": "right"
     *        ]
     *    }
     *
     * @apiSuccessExample UnauthorizedError:
     *     HTTP/1.1 200 UnauthorizedError
     *     {
     *        error: true,
     *        status: 401,
     *        message: 'Unauthorized.'
     *     });
     *
     * @apiSuccessExample ServerError:
     *     HTTP/1.1 200 ServerError
     *     {
     *        error: true,
     *        status: 500,
     *        message: 'An error occured.'
     *     });
     */
    app.get(
      "/messages",
      AuthService.isAuthenticated(),
      MessageController.index
    );

    /**
     * @api {post} /messages New Message
     * @apiName SendMessage
     * @apiGroup Messages
     *
     * @apiParam {Number} from ID of the sender.
     * @apiParam {String} to ID of the receiver.
     * @apiParam {String} text Text of the message.
     * @apiParam {Object} data Any extra data for the message.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} message  Message.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error": false,
     *        "message": "Message sent.",
     *        "data": {
     *
     *        }
     *    }
     *
     * @apiSuccessExample UnauthorizedError:
     *     HTTP/1.1 200 UnauthorizedError
     *     {
     *        error: true,
     *        status: 401,
     *        message: 'Unauthorized.'
     *     });
     *
     * @apiSuccessExample ValidationError:
     *     HTTP/1.1 200 ValidationError
     *     {
     *        error: true,
     *        status: 422,
     *        message: 'Validation failed.',
     *        data: [
     *          {
     *            "type": "from",
     *            "message": "Sender of message is required."
     *          }
     *        ]
     *     });
     *
     *
     * @apiSuccessExample ServerError:
     *     HTTP/1.1 200 ServerError
     *     {
     *        error: true,
     *        status: 500,
     *        message: 'An error occured.'
     *     });
     */
    app.post(
      "/messages",
      AuthService.isAuthenticated(),
      MessageController.create
    );

    /**
     * @api {get} /messages/id Chat thread
     * @apiName MessageChat
     * @apiGroup Messages
     *
     * @apiParam {String} id User id of the person in conversation.
     * @apiParam {Number} page=1 Page number.
     * @apiParam {Number} limit=10 Results per page.
     *
     * @apiSuccess {String} error If expected error occured.
     * @apiSuccess {Object} data  Chat messages.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "error":false,
     *        "data": [
     *          {
     *            "_id": "5b16f4c3431e01dd64a90761",
     *            "me": {
     *              "_id": "5a8caf697f6c946b4d5c1d36",
     *              "name": "Admin"
     *            },
     *            "other": {
     *              "_id": "5a8caf697f6c946b4d5c1d3a",
     *              "name": "Some User"
     *            },
     *            "text": "masd",
     *            "body": {},
     *            "createdAt": "2018-06-05T21:18:54.636Z",
     *            "updatedAt": "2018-06-05T21:18:54.636Z",
     *            "seen": false,
     *            "position": "left"
     *          }
     *        ]
     *    }
     *
     * @apiSuccessExample UnauthorizedError:
     *     HTTP/1.1 200 UnauthorizedError
     *     {
     *        error: true,
     *        status: 401,
     *        message: 'Unauthorized.'
     *     });
     *
     * @apiSuccessExample ServerError:
     *     HTTP/1.1 200 ServerError
     *     {
     *        error: true,
     *        status: 500,
     *        message: 'An error occured.'
     *     });
     */
    app.get(
      "/messages/:otherUser",
      AuthService.isAuthenticated(),
      MessageController.show
    );
  }
}
