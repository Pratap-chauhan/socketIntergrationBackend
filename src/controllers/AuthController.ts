import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';

import User from "../models/User";

import UserEvents from '../events/UserEvents';
import AuthEvents from '../events/AuthEvents';
import Tracking from '../events/Tracking';

import DefaultConfig from '../config/Default';

import GithubService from '../services/GithubService';
import AuthService from '../services/AuthService';

export default class AuthController {

  static async login(req: Request, res: Response) {

    const { token } = req.body;
    if (! token) return res.status(422).json({error: true, message: 'Github access token is required.'});

    Tracking.log({ type: 'auth.login', message: 'Login user', data: {} });

    try {
      const accessToken = await GithubService.getAccessToken(token);
      const githubUser = await GithubService.getUserFromAccessToken(accessToken);
      const userExists = await User.findOne({ id: githubUser.id });

      if (userExists) {
        Tracking.log({ type: 'auth.login', message: 'Login successful', data: { githubUser } });
      } else {
        const user = await User.create(githubUser)
        Tracking.log({ type: 'auth.register', message: 'Register successful', data: { githubUser } });
        // Fire User creation event
        UserEvents.created(user);
      }

      return res.json({
        error: false,
        data: AuthController.getUserAndToken(githubUser),
        message: `Welcome, ${githubUser.name}`
      });
    } catch (e) {
      Tracking.log({ type: 'auth.error', message: 'Error occured logging in.', data: e });
      return res.json({ error: true, data: e });
    }
  }

  static getUserAndToken(user) {
    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      token: AuthService.signToken(user)
    }
  }

  static logout(req: Request, res: Response) {
    // Add logic to track
    req.logout();

    Tracking.log({ type: 'auth.logout', message: 'Logout', data: {} });
    return res.json({
      error: false,
      message: `Logout successful`
    })
  }
}