import { Request, Response } from 'express';

import User from '../models/User';
import Company from '../models/Company';
import UserService from '../services/UserService';
import { UserEvents } from '../events/UserEvents';

export default class ProfileController {

  static me(req: Request, res: Response) {
    let { user } = req;

    let data: any = {};
    if (user.role === 'candidate') {
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
      data = {
        _id: user._id,
        approved: user.approved,
        avatar: user.avatar,
        name: user.name
      };
    } else {
    }
    return res.json({ error: false, data });
  }

  static async onboarding(req: Request, res: Response) {
    const { user } = req;
    let data = {};

    if (user.role === 'candidate') {
      data = {
        onboarding: user.onboarding,
        profile: {
          avatar: user.avatar,
          email: user.email,
          name: user.name
        },
        locations: user.locations,
        designation: user.designation,
        skills: user.skills,
        projects: user.projects,
        experience_role: user.experience_role,
        looking_for: user.looking_for,
        availability: user.availability,
        salary: user.salary,
        image_url : user.image_url
      }
    } else {
      data = {
        onboarding: user.onboarding,
        profile: {
          avatar: user.avatar,
          email: user.email,
          locations: user.locations,
          name: user.name,
          company: user.company_id ? await Company.findById(user.company_id) : null
        }
      }
    }

    return res.json({ error: false, data });
  }

  static update(req: Request, res: Response) {
    const { user } = req;
    if (user.role === 'candidate') {
      return ProfileController.updateCandidate(req, res);
    } else if (user.role === 'hr') {
      return ProfileController.updateHR(req, res);
    } else {
      // return ProfileController.updateCandidate(req, res);
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
        locations: body.locations || user.locations,
        onboarding: false
      };

      // Update
      await User.findByIdAndUpdate(user._id, { $set: update });
      UserEvents.updated(user);
      return res.json({ error: false, message: 'Profile updated successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.', });
    }
  }

  private static async updateHR(req: Request, res: Response) {
    try {
      const { user, body } = req;

      const errors = UserService.validateHR(user, body);
      if (errors) {
        return res.json({
          error: true,
          status: 422,
          data: errors
        });
      }

      // Update object
      const update = {
        name: body.name || user.name,
        email: body.email || user.email,
        company_id: body.company_id || user.company_id,
        onboarding: false
      };

      // Update
      await User.findByIdAndUpdate(user._id, { $set: update });
      return res.json({ error: false, message: 'Profile updated successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.', });
    }
  }
}