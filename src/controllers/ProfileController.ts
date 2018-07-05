import { Request, Response } from 'express';

import User from '../models/User';
import UserService from '../services/UserService';

export default class ProfileController {

  static me(req: Request, res: Response) {
    let { user } = req;

    let data: any = {};
    if (user.role === 'user') {
      data = {
        _id: user._id,
        approved: user.approved,
        avatar: user.avatar,
        bio: user.bio,
        company: user.company,
        login: user.login,
        name: user.name
      };
    } else if (user.role === 'hr') {

    } else {
    }
    return res.json({ error: false, data });
  }

  static onboarding(req: Request, res: Response) {
    const { user } = req;
    let data = {};

    if (user.role === 'candidate') {
      data = {
        onboarding: user.onboarding,
        profile: {
          avatar: user.avatar,
          email: user.avatar,
          location: user.location,
          name: user.name
        },
        designation: user.designation,
        skills: user.skills,
        projects: user.projects,
        experience_role: user.experience_role,
        looking_for: user.looking_for,
        availability: user.availability,
        salary: user.salary
      }
    } else {
      data = {
        onboarding: user.onboarding,
        profile: {
          avatar: user.avatar,
          email: user.avatar,
          location: user.location,
          name: user.name
        }
      }
    }

    return res.json({ error: false, data });
  }

  static update(req: Request, res: Response) {
    const { user } = req;
    if (user.role === 'user') {
      return ProfileController.updateCandidate(req, res);
    } else if (user.role === 'hr') {
      return ProfileController.updateHR(req, res);
    }
    return res.json({ error: true, status: 404, message: 'Invalid request.' });
  }

  private static async updateCandidate(req: Request, res: Response) {
    try {
      const { user, body } = req;

      const errors = UserService.validateCandidate(user, body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors
        });
      }

      // Update object
      const update = {
        designation: body.designation || user.designation,
        skills: body.skills || user.skills,
        projects: body.projects || user.projects,
        name: body.name || user.name,
        email: body.email || user.email,
        experience_role: body.experience_role || user.experience_role,
        looking_for: body.looking_for || user.looking_for,
        availability: body.availability || user.availability,
        salary: body.salary || user.salary,
        onboarding: false
      };

      // Update
      await User.findByIdAndUpdate(user._id, { $set: update });
      return res.json({ error: false, message: 'Profile updated successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.', });
    }
  }

  private static async updateHR(req: Request, res: Response) {
  }
}