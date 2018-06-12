import { map } from 'lodash';
import Mailer from './Mailer';

class StarkflowMailer extends Mailer {

  constructor(toEmail: string) {
    super(toEmail);
  }

  async sendMessage(data) {
    const template_name = 'starkflow';
    let { template, html } = await this.getTemplate(template_name);
    this.subject = template.subject || `New message on Starkflow from ${data.name}`;
    this.setFromEmail(data.email);

    // The focussed text
    const REPLACE_HEADER_TEXT = `${data.name} sent message via ${data.type} form.`;

    // The complied text
    let REPLACE_THE_MESSAGE = '<ul style="padding: 0; margin: 0 0 10px 0; list-style-type: disc;">';
    let variableMap = {};
    if (data.type === 'contact') {
     variableMap = {
        Name: data.name,
        Email: data.email,
        Country: data.country,
        Phone: data.phone,
        Message: data.message
      };
    } else if (data.type === 'custom') {
      variableMap = {
        Name: data.name,
        Email: data.email,
        Details: data.details
      };
      data.similar.forEach((u, i) => {
        variableMap[`URL#${i}`] = u;
      });
    } else if (data.type === 'wizard') {
      const module_list = data.modules.map(m => {
        return m.sub_modules.map(sm => {
          return `<li style="margin:0 0 10px 30px;"><strong>${m.title}:</strong> ${sm.title}</li>`;
        }).join('');
      }).join('');
      variableMap = {
        Name: data.name,
        Email: data.email,
        Phone: data.phone,
        Message: data.message,
        Country: data.country,
        AppFor: data.appFor,
        App: data.apps.map(x => x.title).join(', '),
        Platform: data.platforms.map(x => x.title).join(', '),
        Category: data.categories.map(x => x.title).join(', '),
        Modules: `<ul style="padding: 0; margin: 0 0 10px 0; list-style-type: disc;">${module_list}</ul>`
      };
    }
    REPLACE_THE_MESSAGE += map(variableMap, (value, key) => {
      return `<li style="margin:0 0 10px 30px;"><strong>${key}:</strong> ${value}</li>`;
    }).join('');
    REPLACE_THE_MESSAGE += '</ul>';

    // Client ip details
    const REPLACE_CLIENT_DATA = map(data.client, (value, key) => {
      return `<li style="margin:0 0 10px 30px;"><strong>${key}:</strong> ${value}</li>`;
    }).join('');

    const variables = [
      { replace: 'REPLACE_SUBJECT', value: this.subject },
      { replace: 'REPLACE_CLIENT_DATA', value: REPLACE_CLIENT_DATA },
      { replace: 'REPLACE_HEADER_TEXT', value: REPLACE_HEADER_TEXT },
      { replace: 'REPLACE_THE_MESSAGE', value: REPLACE_THE_MESSAGE },
    ];

    // Replace vars in html
    this.html = this.replaceVarsInHtml(html, variables);
    console.log(`Mail: Sending sendMessage@StarkflowMailer`);
    this.send();
  }
}

export default StarkflowMailer;