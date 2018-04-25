"use strict";
import * as mongoose from 'mongoose';

import DBConfig from '../config/DB';

class DB {

  static queries = 0;

  static init(dbUrl: string = '') {
    // Url validation
    const URL = dbUrl != '' ? dbUrl : DBConfig.url;
    if (! URL) {
      throw Error(`MongoDB connection url is required, none given.`);
    }

    // Connection options
    const options = {
      user: DBConfig.user,
      pass: DBConfig.pass,
    };

    return DB.establishConnection(URL, options);
  }

  static establishConnection(url: string, options: object) {
    return mongoose.connect(url, options)
      .then( () => {
        console.log(`DB: Connected to ${url}`);
        mongoose.set('debug', (collectionName, method, query, doc) => {
          DB.queries++;
          console.log(`Query#${DB.queries}: ${collectionName}.${method}`, query);
        });
      })
      .catch( (error) => {
        console.log("Mongoose failed to connect to MongoDB.");
        console.error("Mongoose connection error: ", error);
        process.exit(0);
      });
  }
};

export default DB;