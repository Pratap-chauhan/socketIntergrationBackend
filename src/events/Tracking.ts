import Event from '../models/Event';
import * as S from 'con'

const env_type = process.env.NODE_ENV || 'development';

class Tracking {

  static log({type, message, data}) {

    if (env_type === 'development') {
      console.log(JSON.stringify({ type, message, data }));
      return;
    }

    if (!type) {
      console.log(`Type is required for Tracking`);
    }
    if (!message) {
      console.log(`Message is required for Tracking`);
    }
    return Event.create({type, message, data});
  }
}

export default Tracking;