import * as Request from 'request';

export default class GithubService {

  static getAccessToken(code: String, origin: String) {
    let client_secret = process.env.GITHUB_CLIENT_SECRET;
    let client_id = process.env.GITHUB_CLIENT_ID;

    if (origin && origin.match('localhost')) {
      console.log(`Origin is present and using GH DEV credentials: ${origin}`);
      client_id = process.env.GITHUB_CLIENT_ID_DEV;
      client_secret = process.env.GITHUB_CLIENT_SECRET_DEV;
    }

    const options = {
      method: 'POST',
      uri: process.env.GITHUB_ACCESS_TOKEN_URL || 'https://github.com/login/oauth/access_token',
      json: true,
      body: { client_id, client_secret, code }
    };

    return new Promise((resolve, reject) => {
      Request(options, (error, response) => {
        if (error) {
          return reject(error);
        }
        response = response.toJSON();
        if (response.statusCode > 399) {
          return reject(response.body.error || response.body);
        }
        return resolve(response.body.access_token);
      });
    });
  }

  static getUserFromAccessToken(token: String) {
    const uri = process.env.GITHUB_API_URL || 'https://api.github.com/graphql';
    const body = {
      query: "{ user: viewer { avatar: avatarUrl    bio    bioHTML    company    ghCreated: createdAt    email    id    isEmployee    isHireable    isBountyHunter    isCampusExpert    isDeveloperProgramMember    location    login    url    name    email    resourcePath    websiteUrl  }}"
    };
    const headers = {
      "User-Agent": `mabaasit`,
      "Authorization": `Bearer ${token}`
    };
    const options = {
      method: 'POST',
      uri,
      json: true,
      headers,
      body
    };

    return new Promise((resolve, reject) => {
      Request(options, (error, response) => {
        if (error) {
          return reject(error);
        }
        response = response.toJSON();
        if (response.statusCode > 399) {
          return reject(response.body);
        }
        return resolve(response.body.data.user);
      });
    });
  }
}