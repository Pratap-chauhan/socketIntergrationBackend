import { Request, Response } from 'express';

import AppData from '../models/AppData';
import Bundle from '../models/Bundle';
import SubModule from '../models/SubModule';
import Platform from '../models/Platform';
import Category from '../models/Category';


export default class AppDataController {

  static async skills(req: Request, res: Response) {
    req.query.type = 'skills';
    return AppDataController.findData(req, res);
  }

  static async designations(req: Request, res: Response) {
    req.query.type = 'designations';
    return AppDataController.findData(req, res);
  }

  static async domains(req: Request, res: Response) {
    req.query.type = 'domains';
    return AppDataController.findData(req, res);
  }

  static async features(req: Request, res: Response) {
    req.query.type = 'features';
    return AppDataController.findData(req, res);
  }

  private static async findData(req: Request, res: Response) {
    let { q, type } = req.query;

    const project = { _id: 1, title: 1 };
    if (type === 'skills') {
      project['parent'] = 1;
    }

    const finder = { type };
    // Searching
    if (q) {
      finder['title'] = new RegExp(q, 'ig');
    }

    try {
      const data = await AppData.find(finder, project).sort({ title: 1 });
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async initalDataSF(req: Request, res: Response) {
    try {
      const platforms = await Platform.find({}, { title: 1, description: 1, icon: 1 });
      const categories = await Category.find({}, { title: 1, description: 1, icon: 1 });
      return res.json({ error: false, data: { categories, platforms } });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async bundles(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) {
      return res.json({ error: true, message: 'Search param is required.' });
    }

    try {
      const lookups = ['categories', 'platforms', 'sub_modules'];

      const aggreate: any = [
        { $match: { title: new RegExp(q, 'ig') } }
      ];

      lookups.forEach(item => {
        aggreate.push({ $unwind: { path: `$${item}`, preserveNullAndEmptyArrays: true } });
        aggreate.push({
          $lookup: {
            "from": item,
            "as": item,
            "localField": item,
            "foreignField": "_id"
          }
        });
        aggreate.push({ $unwind: { path: `$${item}`, preserveNullAndEmptyArrays: true } });
      });

      aggreate.push({
        "$lookup": {
          "from": "modules",
          "as": "sub_modules.module",
          "localField": "sub_modules.module_id",
          "foreignField": "_id"
        }
      });
      aggreate.push({
        "$unwind": {
          "path": "$sub_modules.module",
          "preserveNullAndEmptyArrays": true
        }
      });

      aggreate.push({
        $group: {
          _id: { _id: "$_id", title: "$title", description: "$description" },
          categories: { $addToSet: "$categories" },
          platforms: { $addToSet: "$platforms" },
          sub_modules: { $addToSet: "$sub_modules" },
        }
      });

      aggreate.push({
        $project: {
          _id: "$_id._id", title: "$_id.title", description: "$_id.description",
          platforms: {
            _id: 1,
            title: 1,
            description: 1,
            icon: 1,
          }, categories: {
            _id: 1,
            title: 1,
            description: 1
          }, sub_modules: {
            _id: 1,
            title: 1,
            description: 1,
            module: { _id: 1, title: 1 }
          }
        }
      });

      const data = await Bundle.aggregate(aggreate);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static async modules(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) {
      return res.json({ error: true, message: 'Search param is required.' });
    }

    try {
      const aggreate = [
        { $match: { title: new RegExp(q, 'ig') } },
        { $lookup: {
          "from": "modules",
          "as": "module",
          "localField": "module_id",
          "foreignField": "_id"
        }},
        { $unwind: { path: "$module", preserveNullAndEmptyArrays: true }},
        { $project: {
          _id: 1, title: 1, description: 1, module: 1
        }}
      ];

      const data = await SubModule.aggregate(aggreate);
      return res.json({ error: false, data });
    } catch (e) {
      return res.json({ error: true, status: 500, message: 'An error occured.' });
    }
  }

  static initalDataCandidates(req: Request, res: Response) {
    const data = {
      hr_roles: [
        {id: 1, title: 'Data Engineer'},
        {id: 2, title: 'Business Analyst'},
        {id: 3, title: 'Project Manager'},
        {id: 4, title: 'QA Engineer'},
        {id: 5, title: 'Support'},
        {id: 6, title: 'DevOps'},
        {id: 7, title: 'Full Stack Developer'},
        {id: 8, title: 'Front-End Developer'},
        {id: 9, title: 'Back-End Developer'},
      ],
      experience_role: [
        {id: 1, title: 'Intern'},
        {id: 2, title: 'Fresher'},
        {id: 3, title: 'Junior'},
        {id: 4, title: 'Mid Level'},
        {id: 5, title: 'Senior'},
        {id: 6, title: 'Lead'},
      ],
      looking_for: [
        {id: 1, title: 'Contract'},
        {id: 2, title: 'Permanent'},
        {id: 3, title: 'Both'},
      ],
      availability: [
        {id: 1, title: 'Immediately'},
        {id: 2, title: 'In 1 week'},
        {id: 3, title: 'In 2 weeks'},
        {id: 4, title: 'In 1 month'},
        {id: 5, title: 'More than a month'},
      ],
      currency: [
        {id: 1, title: 'USD'},
        {id: 2, title: 'EUR'},
        {id: 3, title: 'GBP'},
        {id: 4, title: 'INR'},
        {id: 5, title: 'RUB'},
      ],
      duration: [
        {id: 1, title: 'Hour'},
        {id: 2, title: 'Week'},
        {id: 3, title: 'Month'},
        {id: 4, title: 'Year'}
      ],
      project_duration: [
        {id: 1, title: 'Week'},
        {id: 2, title: 'Month'},
        {id: 3, title: 'Year'}
      ],
      salary: {
        curreny: [
          {id: 1, title: 'USD'},
          {id: 2, title: 'EUR'},
          {id: 3, title: 'GBP'},
          {id: 4, title: 'INR'},
          {id: 5, title: 'RUB'},
        ],
        duration: [
          {id: 1, title: 'Hour'},
          {id: 2, title: 'Week'},
          {id: 3, title: 'Month'},
          {id: 4, title: 'Year'}
        ]
      }
    }
    return res.json({ error: false, data });
  }
}