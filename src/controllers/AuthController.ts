import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

import User from "../models/User";
import Tracking from '../events/Tracking';
import GithubService from '../services/GithubService';
import AuthService from '../services/AuthService';

export default class AuthController {

  static login(req: Request, res: Response) {
    const { provider } = req.body;
    if (provider === 'linkedin') {
      return AuthController.authenticateLI(req, res);
    } else {
      return AuthController.authenticateGH(req, res);
    }
  }

  static logout(req: Request, res: Response) {
    // Add logic to track
    req.logout();

    Tracking.log({ type: 'auth.logout', message: 'Logout', data: {} });
    return res.json({
      error: false,
      message: `Logout successful`
    });
  }

  static async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({
          error: true,
          status: 422,
          data: [
            { path: 'email', message: 'Email is required.' },
            { path: 'password', message: 'Password is required.' }
          ]
        });
      }

      const user: any = await User.findOne({ email, role: 'admin' });

      if (!user) {
        return res.json({ error: true, status: 404, message: 'User not found.' });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ error: true, status: 401, message: 'Incorrect password.' });
      }

      return res.json({
        error: false,
        data: {
          user: {
            _id: user._id,
            name: user.name,
          },
          token: AuthService.signToken(user)
        }
      });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static async authenticateGH(req: Request, res: Response) {
    const { token } = req.body;
    if (!token) {
      return res.json({
        error: true,
        status: 422,
        data: [{path: 'token', message: 'Github access token is required.'}]
      });
    }

    Tracking.log({ type: 'auth.login', message: 'Login user', data: {provider: 'github', role: 'user'} });

    try {
      const origin = req.get('Origin');

      const accessToken: any = await GithubService.getAccessToken(token, origin);
      const githubUser: any = await GithubService.getUserFromAccessToken(accessToken);
      const userExists: any = await User.findOne({ id: githubUser.id });

      // Set the role to candidate
      githubUser.role = 'candidate';

      if (userExists) {
        githubUser._id = userExists._id;
        githubUser.onboarding = userExists.onboarding;
        Tracking.log({ type: 'auth.login', message: 'Login successful', data: { ...githubUser } });
      } else {
        const user: any = await User.create(githubUser)
        githubUser._id = user._id;
        githubUser.onboarding = user.onboarding;
        Tracking.log({ type: 'auth.register', message: 'Register successful', data: { ...githubUser } });
      }

      return res.json({
        error: false,
        data: AuthController.githubUserAndToken(githubUser),
        message: `Welcome, ${githubUser.name}`
      });
    } catch (e) {
      Tracking.log({ type: 'auth.error', message: 'Error occured logging in.', data: e });
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static async authenticateLI(req: Request, res: Response) {
    try {
      Tracking.log({ type: 'auth.login', message: 'Login', data: { provider: 'linkedin', role: 'hr' } });
      req.body.role = 'hr';
      let user: any = await User.findOne({ id: req.body.id, role: req.body.role });
      req.body.last_logged_in = new Date();
      if (user) {
        await user.update({ ...req.body });
        user = user.toJSON();
        Tracking.log({ type: 'auth.login', message: 'Login successful', data: { ...user } });
      } else {
        user = await User.create(req.body);
        Tracking.log({ type: 'auth.register', message: 'Register successful', data: { ...user } });
      }

      return res.json({
        error: false,
        message: `Welcome, ${user.firstName} ${user.lastName}`,
        data: AuthController.linkedInUserAndToken(user)
      });
    } catch (e) {
      Tracking.log({ type: 'auth.error', message: 'Error occured logging in.', data: e });
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static githubUserAndToken(user) {
    return {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        onboarding: user.onboarding
      },
      token: AuthService.signToken(user)
    }
  }

  private static linkedInUserAndToken(user) {
    user = {
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.pictureUrl
    };
    return {
      user,
      token: AuthService.signToken(user)
    }
  }
}