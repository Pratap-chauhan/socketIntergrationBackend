import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import User from "../models/User";
import Tracking from '../events/Tracking';
import GithubService from '../services/GithubService';
import AuthService from '../services/AuthService';
import AuthEvents from '../events/AuthEvents';

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
        data: AuthController.userAndToken(githubUser),
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
      req.body.name = `${req.body.firstName} ${req.body.lastName}`;
      req.body.email = req.body.emailAddress;
      req.body.avatar = req.body.pictureUrl;
      req.body.last_logged_in = new Date();
      if (user) {
        await user.update({ ...req.body });
        user = user.toJSON();
        Tracking.log({ type: 'auth.login', message: 'Login successful', data: { ...user } });
      } else {
        user = await User.create(req.body);
        Tracking.log({ type: 'auth.register', message: 'Register successful', data: { ...user } });
      }

      // Once HR has created profile from LinkedIn we wil use user.positions.values
      // to get the companies and add them in our DB
      if (user.positions._total > 0) {
        user = await AuthEvents.hrCreated(user);
      }

      return res.json({
        error: false,
        message: `Welcome, ${user.name}`,
        data: AuthController.userAndToken(user)
      });
    } catch (e) {
      Tracking.log({ type: 'auth.error', message: 'Error occured logging in.', data: e });
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  private static userAndToken(user) {
    let hasOnboarding = user.onboarding;
    if(!user.email && !user.name) {
      hasOnboarding = true;
    }

    return {
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        onboarding: hasOnboarding,
        role: user.role
      },
      token: AuthService.signToken(user)
    }
  }
}