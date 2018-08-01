import { Request, Response } from 'express';
import Interest from '../models/Interest';
import { InterestEvents } from '../events/InterestEvents';

export default class InterestController {

  static async create(req: Request, res: Response) {
    
    // job_id, from (the user thats logged in), to (?)
    if (!req.body.to) {
      return res.json({ error: true, status: 422, data: [{ path: 'to', message: 'To is required.' }] });
    }

    const interest = {
      job: req.params.jobId,
      to: req.body.to,
      from: req.user._id
    };

    try {
      const data = await Interest.create(interest);
      //Interest created event
      InterestEvents.created(data);
      
      return res.json({ error: false, message: 'Interest sent.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const { interestid } = req.params;
      await Interest.findByIdAndRemove(interestid);
      return res.json({ error: false, message: 'Unmatched.' });
    } catch(e) {
      return res.json({ error: true, status: 500, message: 'Unexpected error occured.' });
    }
  }
}