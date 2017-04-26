module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'loginapp',
      script    : 'app.js',
      env_production : {
        NODE_ENV: 'production'
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : '46.101.211.213',
      ref  : 'origin/master',
      repo : 'https://github.com/pavelko1608/loginapp.git',
      path : '~/loginapp',
      'post-deploy' : 'npm install && /home/deploy/.nvm/versions/node/v6.10.2/bin/pm2 reload ecosystem.config.js --env production'
    }
  }
};
