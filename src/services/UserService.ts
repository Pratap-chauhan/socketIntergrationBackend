import { isEmail } from 'validator';

export default class UserService {

  static getUpdateValidationErrors(user, data) {
    if (user.role === 'user') {
      return UserService.validateCandidate(user, data);
    } else {
      return UserService.validateHR(user, data);
    }
  }

  static validateCandidate(user, data) {
    const errors = [];

    // Name
    if (!user.name && !data.name) {
      errors.push({ path: 'name', message: 'Name is required.' });
    }

    // Email
    if (!data.email && !user.email) {
      errors.push({ path: 'email', message: 'Email is required.' });
    }

    // Valid Email (Only from data, because user email will be valid)
    if (data.email && !isEmail(data.email)) {
      errors.push({ path: 'email', message: 'Email must be valid.' });
    }

    // Experience Level (Junior, Fresher etc)
    if (!user.experience_role && !data.experience_role) {
      errors.push({ path: 'experience_role', message: 'Experience role is required.' });
    }

    // Type of work loking for
    if (!user.looking_for && !data.looking_for) {
      errors.push({ path: 'looking_for', message: 'Work type looking for is required.' });
    }

    // User availability
    if (!user.availability && !data.availability) {
      errors.push({ path: 'availability', message: 'Availability is required.' });
    }

    // User salary
    if (!user.salary && !data.salary) {
      errors.push({ path: 'salary', message: 'Salary is required.' });
    }

    return Object.keys(errors).length > 0 ? errors : false;
  }

  static validateHR(user, data) {
    const errors = [];

    // Name
    if (!user.name && !data.name) {
      errors.push({ path: 'name', message: 'Name is required.' });
    }

    // Email
    if (!data.email && !user.email) {
      errors.push({ path: 'email', message: 'Email is required.' });
    }

    // Valid Email (Only from data, because user email will be valid)
    if (data.email && !isEmail(data.email)) {
      errors.push({ path: 'email', message: 'Email must be valid.' });
    }

    return Object.keys(errors).length > 0 ? errors : false;
  }
}