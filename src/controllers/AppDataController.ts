import { Request, Response } from 'express';

import AppData from '../models/AppData';

export default class AppDataController {
  static async index(req: Request, res: Response) {
    const { type, search, limit } = req.query;

    const finder = {
      type: type || null,
      title: search ? new RegExp(search, 'ig') : null
    };

    const data = await AppData.find(finder);

    return res.json({
      error: false,
      query: req.query,
      data
    })
  }
}