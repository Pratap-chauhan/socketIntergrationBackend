import AuthMailer from '../mailers/AuthMailer';

class UserEvents {
  // Event to fire when user is created
  created(user) {
    // Send mail
    const mailer = new AuthMailer(user.email);
    mailer.userCreated(user);
  }

  // When admin adds user
  userAddedByAdmin(user) {
    // Send mail
    const mailer = new AuthMailer(user.email);
    mailer.userAddedByAdmin(user);
  }
}

const Events = new UserEvents();
export default Events;