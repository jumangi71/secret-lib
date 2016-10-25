
module.exports.email = {
  host: 'localhost',
  port: 25,
  auth: {
    user: 'mailagent',
    pass: '7531594682'
  },
  templateDir: 'views/emailTemplates',
  from: 'info@nakedtube.ru',
  testMode: false,
  ssl: false,
  tls:{
    rejectUnauthorized: false
  }
};