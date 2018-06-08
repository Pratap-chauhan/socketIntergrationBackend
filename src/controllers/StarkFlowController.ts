import { Request, Response } from 'express';
import * as _ from 'lodash';

import StarkFlow from '../models/StarkFlow';

export default class StarkFlowController {

  static async wizard(req: Request, res: Response) {
    const { name, email } = req.body;

    const data = { name, email };
    const errors = StarkFlowController.validate(data);
    if (errors) {
      return res.status(422).json({error: true, message: 'Validation failed.', data: errors});
    }

    req.body.type = 'wizard';

    return StarkFlowController.insertData(req.body, res);
  }

  static async custom(req: Request, res: Response) {
    const { client, name, email, details, similar } = req.body;

    const data = { name, email, details, similar };
    const errors = StarkFlowController.validate(data);
    if (errors) {
      return res.status(422).json({error: true, message: 'Validation failed.', data: errors});
    }

    data['type'] = 'custom';
    data['client'] = client;

    return StarkFlowController.insertData(data, res);
  }

  static async contact(req: Request, res: Response) {
    const { client, name, email, message, country, phone } = req.body;

    const data = { name, email, message, country, phone };
    const errors = StarkFlowController.validate(data);
    if (errors) {
      return res.status(422).json({error: true, message: 'Validation failed.', data: errors});
    }

    data['type'] = 'contact';
    data['client'] = client;

    return StarkFlowController.insertData(data, res);
  }

  static validate(data) {
    const errors = [];

    _.forEach(data, (value, title) => {
      if (!value) {
        errors.push(`${_.upperFirst(title)} is required.`);
      }
    });

    return errors.length > 0 ? errors : false;
  }

  static async insertData(data, res) {
    try {
      await StarkFlow.create(data);
      return res.status(200).json({error: false, message: 'Message sent.'});
    } catch (e) {
      return res.status(500).json({error: true, message: 'Error occured.'});
    }
  }
}