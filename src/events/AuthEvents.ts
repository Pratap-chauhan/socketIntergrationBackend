import AuthMailer from '../mailers/AuthMailer';

class AuthEvents {
  // user resets password
  reset(user) {
    // Send mail
    const mailer = new AuthMailer(user.email);
    mailer.sendResetMail(user);
  }
}

const Events = new AuthEvents();
export default Events;