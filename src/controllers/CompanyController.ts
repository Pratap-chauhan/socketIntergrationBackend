import { Request, Response } from 'express';
import Company from '../models/Company';

export default class CompanyController {

  static async index(req: Request, res: Response) {
    const finder = {};
    if (req.query.q) {
      finder['title'] = new RegExp(req.query.q, 'ig');
    }
    const data = await Company.find(finder);
    return res.json({error: false, data})
  }

  static async create(req: Request, res: Response) {
    const { body } = req;
    if (!body.title) {
      return res.json({ error: true, status: 422, data: [{ path: 'title', message: 'Title of the company is required.' }] });
    }

    try {
      const data = await Company.create(req.body);
      return res.json({ error: false, message: 'Company added successfully.', data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'Company add failed.' });
    }
  }

  static async show(req: Request, res: Response) {
    const data = await Company.findById(req.params.id);
    return res.json({ error: false, data });
  }

  static async update(req: Request, res: Response) {
    const { body } = req;

    try {
      const company: any = await Company.findById(req.params.id);

      company.title = body.title || company.title;
      company.description = body.description || company.description;
      company.logo = body.logo || company.logo;

      await company.save();

      return res.json({ error: false, message: 'Company updated successfully.' });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'Company update failed.' });
    }
  }
}