module.exports = {
  apps: [
    {
      name: 'SourcableAPI',
      script: 'dist/Server.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'SourcableTasksRunner',
      script: 'dist/tasks/index.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'starkflow',
      host: '185.3.94.95',
      ref: 'origin/master',
      repo: 'git@gitlab.com:sourcable/backend.git',
      path: '/home/starkflow/Sourceable',
      'post-deploy': 'npm install && npm build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
