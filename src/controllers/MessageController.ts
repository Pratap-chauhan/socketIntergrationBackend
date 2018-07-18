import { Request, Response } from 'express';
import Message from '../models/Message';

export default class MessageController {

  // Data to show the sidebar of the messaging (all chats)
  static async index(req: Request, res: Response) {
    let { page, limit } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const user = req.user._id;

    const aggregate = [
      {$match: {$or: [{from: user}, {to: user}]}},
      {$sort: {createdAt: -1}},
      {$project: {
        createdAt: 1, text: 1, users: {from: '$from', to: '$to'}, from: 1, to: 1,
        userIds: [
          {$cond: { if: { $eq: ['$from', user] }, then: '$from', else: '$to'}},
          {$cond: { if: { $ne: ['$to', user] }, then: '$to', else: '$from'}},
        ]
      }},
      {$group: {
        _id: '$userIds',
        users: {$first: '$users'},
        text: {$first: '$text'},
        createdAt: {$first: '$createdAt'}
      }},
      {$lookup: {localField: 'users.from', foreignField: '_id', from: 'users', as: 'from'}},
      {$lookup: {localField: 'users.to', foreignField: '_id', from: 'users', as: 'to'}},
      {$unwind: '$from'},
      {$unwind: '$to'},
      {$project: {
        _id: 0, text: 1, createdAt: 1, from: {_id: 1, name: 1, avatar: 1}, to: {_id: 1, name: 1, avatar: 1}
      }},
      {$sort: {createdAt: -1}},
      {$skip: (page - 1) * limit},
      {$limit: limit}
    ];
    try {
      let messages = await Message.aggregate(aggregate);
      messages = messages.map(x => MessageController.transformMessage(x, req.user._id));
      return res.json({error: false, data: messages});
    } catch(e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  // Create a message
  static async create(req: Request, res: Response) {
    try {
      const errors = MessageController.validateMessage(req.body);
      if(errors) {
        return res.json({error: true, status: 422, data: errors, message: 'Validation failed.'});
      }

      if(String(req.user._id) !== String(req.body.from)) {
        return res.json({error: true, status: 401, message: 'Unauthorized.'});
      }
      let message = await Message.create(req.body);

      message = await Message.findById(message._id)
                  .populate({path: 'to', select: ['_id', 'name', 'avatar']})
                  .populate({path: 'from', select: ['_id', 'name', 'avatar']});

      message = MessageController.transformMessage(message, req.user._id);
      return res.json({ error: false, message: 'Message sent.', data: message });
    } catch(e) {
      return res.json({error: true, status: 500, message: `An error occured. ${e.message}`});
    }
  }

  // Show a chat thread between passed user and the logged in user
  static async show(req: Request, res: Response) {
    let { page, limit } = req.query;
    const { id } = req.params;

    if(req.user._id === id) {
      return res.status(400).send('Error');
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let finder: any = {
      $and: [
        { from: { $in: [req.user._id, id]} },
        { to: {$in: [req.user._id, id]} }
      ]
    };

    try {
      let messages = await Message.find(finder)
                                  .sort({ createdAt: -1 })
                                  .skip((page - 1) * limit)
                                  .limit(limit)
                                  .populate({path: 'to', select: ['_id', 'name', 'avatar']})
                                  .populate({path: 'from', select: ['_id', 'name', 'avatar']});
      messages = messages.map(x => MessageController.transformMessage(x, req.user._id));

      finder.seen = false;
      finder.to = req.user._id;
      await Message.find(finder).update({$set: {seen: true, seenAt: new Date()}});

      return res.json({error: false, data: messages});
    } catch(e) {
      return res.json({error: false, status: 500, message: 'An error occured.'});
    }
  }

  private static validateMessage(data) {
    const errors = [];
    if(!data.from) {
      errors.push({type: 'from', message: 'Sender of message is required.'});
    }

    if(!data.to) {
      errors.push({type: 'to', message: 'Receiver of message is required.'});
    }

    if(!data.text) {
      errors.push({type: 'text', message: 'Text of message is required.'});
    }

    if(data.from && data.to && data.from === data.to) {
      errors.push({type: 'to', message: 'You can not send message to yourself.'});
    }

    if(errors.length === 0) {
      return false;
    }
    return errors;
  }

  private static transformMessage(message: any, myId: any) {
    /**
     * LoggedInUser: Basit
     * {
     *    from: {id: 1,  name: 'Basit'},
     *    to: {id: 2,  name: 'Narek'},
     *    text: 'Yello'
     * }
     */
    if(message.toJSON) {
      message = message.toJSON();
    }
    // If message is from Basit to Narek
    if(String(message.from._id) === String(myId)) {
      message.me = message.from;
      message.other = message.to;
      message.position = 'right';
    } else {
      message.me = message.to;
      message.other = message.from;
      message.position = 'left';
    }

    delete message.to;
    delete message.from;
    return message;
  }
}