import Company from "../models/Company";
import User from "../models/User";

const env_type = process.env.NODE_ENV || 'development';

class AuthEvents {

  static async hrCreated(user: any) {
    let companies = [];
    // Map the companies in simple form
    user.positions.values.forEach(position => {
      companies.push({
        title: position.company.name,
        addedBy: user._id,
        linkedIn: position.company
      });
    });

    // The current company of the user
    const hrCurrentCompany = companies[0];

    // Get the companies from DB from user's linkedIn compaies
    const finder = { 'linkedIn.id': { $in: companies.map(x => x.linkedIn.id) } };
    let existingCompanies: any = await Company.find(finder);

    // Map to array of ids
    existingCompanies = existingCompanies.map(x => x.toJSON ? x.toJSON().linkedIn.id : x.linkedIn.id);

    // Now filter the companies to create
    companies = companies.filter(x => existingCompanies.indexOf(x.linkedIn.id) === -1);

    // Fix for uniqueness
    await Company.insertMany(companies);

    if (! user.company_id) {
      const currentCompany = await Company.findOne({ 'linkedIn.id': hrCurrentCompany.linkedIn.id });
      await User.findByIdAndUpdate(user._id, {$set: {company_id: currentCompany._id}});
    }

    user = await User.findById(user._id).populate({ path: 'company_id', select: ['linkedIn', '_id', 'title'] });
    return user;
  }
}

export default AuthEvents;