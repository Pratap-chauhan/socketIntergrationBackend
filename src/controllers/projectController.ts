import { Request, Response } from 'express';
import * as multer from 'multer'
import User from '../models/User';
import Company from '../models/Company';
import UserService from '../services/UserService';
import { UserEvents } from '../events/UserEvents';

export default class ProjectController {

  static async uploadImages(req: Request, res: Response) {
    let filepath;
    const Storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, './images')
      },
      filename:async function (req, file, callback) {
        this.filepath = 'images/' + file.fieldname + "_" + Date.now() + "_" + file.originalname;
         await  User.updateOne({"_id" : '5b7da6af1a78dd70694bacb1' } ,{$push : {"image_url":this.filepath}});
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
      }
    });
    const upload = multer({
      storage: Storage
    }).array("images", 20);
      upload(req, res, (err) => {
      if (err) 
        return res.json({ error: true, data: 'error' });
      else {
        return res.json({ error: false, data: 'sucessful' });
      }
    })
  }

  static async get(req: Request, res: Response) {
    return res.json({ error : true , data : await User.find({})});
  }
}