import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';

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

  private static async authenticateGH(req: Request, res: Response) {
    const { token } = req.body;
    if (! token) return res.status(422).json({error: true, message: 'Github access token is required.'});

    Tracking.log({ type: 'auth.login', message: 'Login user', data: {provider: 'github', role: 'user'} });

    try {
      const accessToken = await GithubService.getAccessToken(token);
      const githubUser = await GithubService.getUserFromAccessToken(accessToken);
      const userExists = await User.findOne({ id: githubUser.id });

      if (userExists) {
        githubUser._id = userExists._id;
        githubUser.onboarding = userExists.onboarding;
        Tracking.log({ type: 'auth.login', message: 'Login successful', data: { ...githubUser } });
      } else {
        const user = await User.create(githubUser)
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
      return res.json({ error: true, data: e });
    }
  }

  private static async authenticateLI(req: Request, res: Response) {
    try {
      Tracking.log({ type: 'auth.login', message: 'Login', data: {provider: 'linkedin', role: 'hr'} });
      let user = await User.findOne({ id: req.body.id, role: 'hr' });
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
      return res.json({
        error: true,
        message: `An error occured.`
      });
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