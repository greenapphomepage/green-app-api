module.exports = {
  apps: [
    {
      name: 'green-app',
      script: 'npm',
      args: 'run start:prod',
      output: '/dev/null',
      error: '/dev/null',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'dev',
        TZ: 'Asia/Ho_Chi_Minh',
      },
      env_dev: {
        NODE_ENV: 'dev',
        TZ: 'Asia/Ho_Chi_Minh',
      },
      env_production: {
        NODE_ENV: 'production',
        TZ: 'Asia/Ho_Chi_Minh',
      },
    },
  ],
};
