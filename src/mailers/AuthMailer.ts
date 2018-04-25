import Mailer from './Mailer';

class AuthMailer extends Mailer {

  constructor(toEmail: string) {
    super(toEmail);
  }

  async userCreated(user) {
    const template_name = 'welcome';
    let { template, html } = await this.getTemplate(template_name);
    this.subject = template.subject || 'Welcome to Pop Probe.';

    // Process template variables
    const variables = template.variables.map(variable => {
      let value;
      if (variable.replace === "REPLACE_USERNAME") {
        value = user.name || variable.default;
      }
      else if (variable.replace === "REPLACE_VERIFY_LINK") {
        value = `${process.env.ACCOUNT_VERIFY_BASE_URL}?_id=${user._id}`;
      }
      return {replace: variable.replace, value};
    });

    // Replace vars in html
    this.html = this.replaceVarsInHtml(html, variables);
    console.log(`Mail: Sending userCreated@AuthMailer to user ${this.toEmail}`);
    this.send();
  }

  async sendResetMail(user) {
    const template_name = 'reset';
    let { template, html } = await this.getTemplate(template_name);
    this.subject = template.subject || 'Reset Password';

    // Process template variables
    const variables = template.variables.map(variable => {
      let value;
      if (variable.replace === "REPLACE_USERNAME") {
        value = user.name || variable.default;
      }
      else if (variable.replace === "REPLACE_RESET_LINK") {
        value = `${process.env.PASSWORD_RESET_BASE_URL}?_id=${user._id}&reset_token=${user.reset_token}`;
      }
      return {replace: variable.replace, value};
    });
    // Replace vars in html
    this.html = this.replaceVarsInHtml(html, variables);
    console.log(`Mail: Sending sendResetMail@AuthMailer to user ${this.toEmail}`);
    this.send();
  }

  async userAddedByAdmin(user) {
    const template_name = 'admin_added_user';
    let { template, html } = await this.getTemplate(template_name);
    this.subject = template.subject || 'Account created by admin.';
    // Compile the html
    this.html = template.html;
    console.log(`Mail: Sending userAddedByAdmin@AuthMailer to user ${this.toEmail}`);
    this.send();
  }
}

export default AuthMailer;