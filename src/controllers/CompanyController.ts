import { Request, Response } from 'express';
import Company from '../models/Company';
import Pagination from '../services/Pagination';

export default class CompanyController {

  static async index(req: Request, res: Response) {
    const { query } = req;

    query.page = Number(query.page) || 1;
    query.per_page = Number(query.per_page) || 20;

    if (!query.sort_by || (query.sort_by && ['title', 'updatedAt'].indexOf(query.sort_by) === -1)) {
      query.sort_by = 'createdAt';
    }

    if (!query.sort_as || (query.sort_as && query.sort_as === 'desc')) {
      query.sort_as = -1;
    } else {
      query.sort_as = 1;
    }

    const finder = {
      title: new RegExp(query.q, 'ig')
    };

    try {
      const companies = await Company.find(finder)
        .skip(Number(query.page - 1) * Number(query.per_page))
        .limit(Number(query.per_page))
        .sort({ [query.sort_by]: query.sort_as });

      const totalCompanies = await Company.count(finder);
      const paginate = Pagination(totalCompanies, companies.length, query.per_page, query.page);
      return res.json({ error: false, data: { companies, paginate } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
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
    try {
      const data = await Company.findById(req.params.id);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
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