"use strict";
require('dotenv').config();
import * as kue  from 'kue';
import * as nodemailer from 'nodemailer';
import Mail from '../config/Mail';

const getConnection = () => {
  const mailService = Mail.driver;
  const config = Mail[mailService];
  return nodemailer.createTransport(config);
};

const processQueue = (connection, data, done) => {
  const { subject, to, from, html } = data;
  const mailOptions = { subject, to, from, html, text: html };

  connection.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log({ error });
    }
    console.log(`Message sent: ${info.messageId} `);
    done();
  });
};

const init = () => {
  console.log('Initializing Mail Processor');
  const queue = kue.createQueue();
  queue.process('email', 10, (job, done) => {
    console.log('Processing queue');
    const connection = getConnection();
    processQueue(connection, job.data, done);
  });
};

export default init;
