import { Request, Response } from 'express';

import User from '../models/User';

export default class UserController {

  static me(req: Request, res: Response) {
    let { user } = req;
    return res.json({ error: false, data: user });
  }

  static myLoginData(req: Request, res: Response) {
    const { _id, name, avatar, onboarding } = req.user;
    return res.json({
      error: false,
      data: { _id, name, avatar, onboarding }
    });
  }

  static onboarding(req: Request, res: Response) {
    const {
      designation,
      onboarding,
      skills,
      projects,
      avatar, email, location, name
    } = req.user;
    return res.json({
      error: false, data: {
        onboarding,
        profile: { avatar, email, location, name },
        designation,
        skills,
        projects
      }
    });
  }

  static update(req: Request, res: Response) {
    const {
      designation,
      skills,
      projects,
      profile
    } = req.body;
    const _id = req.user._id;
    const update = {
      designation,
      skills,
      projects,
      name: profile.name,
      email: profile.email
    };
    User.updateOne({ _id }, { $set: update })
      .exec()
      .then(user => {
        return res.json({ error: false, message: 'Profile updated successfully.' });
      })
      .catch(error => {
        return res.json({ error: true, message: 'An error occured.', e: error });
      });
  }
}