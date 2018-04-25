import * as kue from 'kue';
import * as fs from 'fs';

import MailTemplate from '../models/MailTemplate';
import Queue from '../services/Queue';

class Mailer {

  public toEmail: string;
  public fromEmail: string;
  public subject: string;
  public html: string;

  public constructor(email: string) {
    if (!email) throw new Error('Email is required.');
    this.toEmail = email;
    this.fromEmail = process.env.FROM_EMAIL || 'Pop Probe<no-reply@popprobe.com>';
  }

  send() {
    const queue = Queue.init();
    const job = queue.create('email', {
      subject: this.subject,
      to: this.toEmail,
      from: this.fromEmail,
      html: this.html
    }).priority('high').attempts(5).removeOnComplete(true).save(error => {
      console.log({ error });
    });
    Queue.attachJobHandlers(job);
  }

  async getTemplate(key: String) {
    const template = await MailTemplate.findOne({ key });
    // No template in database
    if (!template) {
      console.log(`Tried to send mail to user ${this.toEmail}, but the template ${key} was not found`);
      throw new Error(`Email template ${key} not found.`);
    }
    // No html template file in filesystem
    if (!fs.existsSync(template.path)) {
      console.log(`Tried to send mail to user ${this.toEmail}, but the file ${key} was not found`);
      throw new Error(`Email file ${template.path} not found.`);
    }
    const html = fs.readFileSync(template.path).toString();
    return { template, html };
  }

  replaceVarsInHtml(html, vars) {
    // Now replace all the variables
    vars.forEach(item => {
      const regex = new RegExp(item.replace, 'g');
      html = html.replace(regex, item.value);
    });
    return html;
  }
}
export default Mailer;