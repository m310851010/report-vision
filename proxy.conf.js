const PROXY_CONFIG = [
  {
    context: ['/fmk'],
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/fmk/': '/fmk/'
    },
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;
