import * as kue from 'kue';

import DefaultConfig from '../config/Default';

class Queue {

  static init() {
    const queue = kue.createQueue({
      redis: DefaultConfig.REDIS_URL,
      jobEvents: false
    });
    Queue.attachHandlers(queue);
    return queue;
  }

  static attachHandlers(queue) {
    queue
      .on('job enqueue', (id, type) => {
        console.log('Job %s got queued of type %s', id, type);
      })
      .on('job complete', (id, result) => {
        kue.Job.get(id, function(err, job){
          if (err) return;
          job.remove(function(err){
            if (err) throw err;
            console.log('removed completed job #%d', job.id);
          });
        });
      });
  }

  static attachJobHandlers(job) {
    job.log(`The job#${job.id} is being logged`);
    job
    .on('complete', function (result) {
      console.log('Job completed with data ', result);
    })
    .on('failed attempt', function (errorMessage, doneAttempts) {
      console.log('Job failed');
    })
    .on('failed', function (errorMessage) {
      console.log('Job failed');
    })
    .on('progress', function (progress, data) {
      console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
    });
  }
}
export default Queue;
