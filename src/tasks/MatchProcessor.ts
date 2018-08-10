require('dotenv').config();
import * as kue  from 'kue';
import MatchService from '../services/MatchService';

const MatchProcessor = () => {
  console.log('Initializing Match Processor');
  const queue = kue.createQueue();
  queue.process('matchesForJob', 2, MatchService.processMatchesForJob);
  queue.process('matchesForCandidate', 2, MatchService.processMatchesForCandidate);
};

export default MatchProcessor;