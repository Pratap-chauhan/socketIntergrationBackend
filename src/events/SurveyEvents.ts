import Queue from '../services/Queue';

class SurveyEvents {
  created(survey) {
    // Add to survey to queue processing
    console.log({ survey });
  }
}

const Events = new SurveyEvents();
export default Events;