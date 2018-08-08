require('dotenv').config();
import * as kue  from 'kue';

const processQueue = (data, done) => {
  console.log(data);
};



const MatchProcessor = () => {
  console.log('Initializing Match Processor');
  const queue = kue.createQueue();
  queue.process('matchesForJob', 2, (job, done) => {
    console.log('Processing Job Matches');
    processQueue(job.data, done);
  });

  queue.process('matchesForCandidate', 2, (job, done) => {
    console.log('Processing Candidate Matches');
    processQueue(job.data, done);
  });
};

export default MatchProcessor;