import Message from '../models/Message';

export default class MessageController {

  // Data to show the sidebar of the messaging (all chats)
  static async index(req, res) {
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
        _id: 0, text: 1, createdAt: 1, from: {_id: 1, name: 1}, to: {_id: 1, name: 1}
      }},
      {$sort: {createdAt: -1}},
      {$skip: (page - 1) * limit},
      {$limit: limit}
    ];
    try {
      const messages = await Message.aggregate(aggregate);
      return res.json({error: false, data: messages});
    } catch(e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  // Create a message
  static async create(req, res) {
    try {
      const errors = MessageController.validateMessage(req.body);
      if(errors) {
        return res.json({error: true, status: 422, data: errors, message: 'Validation failed.'});
      }

      if(req.user._id.toString() !== req.body.from) {
        console.log({_id: req.user._id.toString(), from: req.body.from});
        return res.json({error: true, status: 401, message: 'Unauthorized.'});
      }
      const message = await Message.create(req.body);
      return res.json({ error: false, message: 'Message sent.', data: message });
    } catch(e) {
      return res.json({error: true, status: 500, message: 'An error occured.'});
    }
  }

  // Show a chat thread between passed user and the logged in user
  static async show(req, res) {
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
      const messages = await Message.find(finder)
                                  .sort({ createdAt: -1 })
                                  .skip((page - 1) * limit)
                                  .limit(limit)
                                  .populate({path: 'to', select: ['_id', 'name']})
                                  .populate({path: 'from', select: ['_id', 'name']});

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

    if(errors.length === 0) {
      return false;
    }
    return errors;
  }
}