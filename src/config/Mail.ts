export default {
  driver: process.env.MAIL_SERVICE || 'MAILTRAP',
  MAILTRAP: {
    pool: true,
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT || 587,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    }
  },
  SENDGRID: {
    name: 'sendgrid',
    auth: {
      api_key: process.env.SENDGRID_APIKEY
    }
  }
}