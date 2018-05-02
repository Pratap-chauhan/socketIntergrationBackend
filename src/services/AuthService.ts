import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
import * as expressJWT from 'express-jwt';
import * as CO from 'composable-middleware';

import User from '../models/User';
const validateJwt = expressJWT({ secret: process.env.SESSION });

export default class AuthService {
	static isAuthenticated() {
		return CO()
			.use(AuthService.validateToken)
      .use(AuthService.attachUser);
  }

  static validateToken(req: Request, res: Response, next: NextFunction) {
    // allow access_token to be passed through query parameter as well
    if(req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    validateJwt(req, res, (error) => {
      if(error) {
        return res.status(401).json({error: true, message: 'Unauthorized', data: error});
      }
      next();
    });
  }

  static attachUser(req: Request, res: Response, next: NextFunction) {
    User.findById(req.user._id, (err, user) => {
      if (err) return res.status(500).send('An error occured');
      if (!user) return res.status(401).send('Unauthorized');
      req.user = user;
      next();
    })
  }

	static signToken({_id, name}) {
		return JWT.sign({ _id, name }, process.env.SESSION);
	}

	static createToken() {
		return Math.random().toString(36).substring(2);
	}
}