import Company from "../models/Company";
import User from "../models/User";

const env_type = process.env.NODE_ENV || 'development';

class AuthEvents {

  static async hrCreated(user: any) {
    const companies = [];
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

    // Get the companies from DB from user's linkedin compaies
    let existingCompanies: any = await Company.find({ linkedin: { id: { $in: [companies.map(x => x.linked.id)] } } });

    // Map to array of ids
    existingCompanies = existingCompanies.map(x => x.toJSON ? x.toJSON().linkedin.id : x.linkedin.id);

    // Now filter the companies to create
    companies.filter(x => existingCompanies.indexOf(x.linkedin.id) === -1);

    // Fix for uniqueness
    await Company.insertMany(companies);

    if (! user.company_id) {
      const currentCompany = await Company.findOne({ linkedin: { id: hrCurrentCompany.linkedin.id } });
      user.company_id = currentCompany._id;
      await user.save();
    }
    user = await User.findById(user._id).populate({ path: 'Company', select: ['linkedin', '_id', 'title'] });
    return user;
  }
}

export default AuthEvents;