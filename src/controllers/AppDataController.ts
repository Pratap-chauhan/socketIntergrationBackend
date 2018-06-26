import { Request, Response } from 'express';

import AppData from '../models/AppData';
import Pagination from '../services/Pagination';
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
      return res.status(500).send('An error occured.');
    }
  }

  static async initalDataSF(req: Request, res: Response) {
    try {
      const platforms = await Platform.find({}, { title: 1, description: 1, icon: 1 });
      const categories = await Category.find({}, { title: 1, description: 1, icon: 1 });
      return res.json({ error: false, data: { categories, platforms } });
    } catch (e) {
      return res.status(500).json('An error occured.');
    }
  }

  static async bundles(req: Request, res: Response) {
    const { q } = req.query;
    if (!q) {
      return res.json({ error: true, message: 'Search param is required.' });
    }

    try {
      const lookups = ['categories', 'platforms', 'modules', 'sub_modules'];

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
        $group: {
          _id: { _id: "$_id", title: "$title", description: "$description" },
          categories: { $addToSet: "$categories" },
          platforms: { $addToSet: "$platforms" },
          modules: { $addToSet: "$modules" },
          sub_modules: { $addToSet: "$sub_modules" },
        }
      });

      aggreate.push({
        $project: {
          _id: "$_id._id", title: "$_id.title", description: "$_id.description",
          platforms: 1, categories: 1, modules: 1, sub_modules: 1
        }
      });

      let data = await Bundle.aggregate(aggreate);

      data = data.map(item => {
        const modules = {};
        item.modules.forEach(x => {
          modules[x._id] = x;
        });
        item.sub_modules = item.sub_modules.map(x => {
          return {
            _id: x._id,
            title: x.title,
            description: x.description,
            module: modules[x.module_id]
          };
        });
        item.platforms = item.platforms.map(x => {
          return {
            _id: x._id,
            title: x.title,
            description: x.description,
            icon: x.icon
          }
        });
        item.categories = item.categories.map(x => {
          return {
            _id: x._id,
            title: x.title,
            description: x.description
          }
        });
        delete item.modules;
        return item;
      });

      return res.json({ error: false, data });
    } catch (e) {
      return res.status(500).json('An error occured.');
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
      return res.status(500).json('An error occured.');
    }
  }
}