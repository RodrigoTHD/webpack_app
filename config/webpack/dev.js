const envName = 'development';
process.env.BABEL_ENV = envName;
process.env.NODE_ENV = envName;

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const configFactory = require('./webpackConfigFactory');
const devServerFactory = require('./webpackDevServerFactory');

try {
  const proxyConfig = undefined;
  const devServerOptions = devServerFactory(proxyConfig, 'all');
  const webpackConfig = configFactory(envName, undefined);
  const webpackConfigcompiler = Webpack(webpackConfig);
  const devServer = new WebpackDevServer(
    devServerOptions,
    webpackConfigcompiler
  );

  devServer.startCallback(() => {
    console.log(chalk.cyan('Starting the development server...\n'));

    const closeServe = function () {
      console.log(chalk.redBright('Closing the development server...\n'));
      devServer.close();
      process.exit();
    };

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, closeServe);
    });

    if (process.env.CI !== 'true') {
      process.stdin.on('end', closeServe);
    }
  });
} catch (ex) {
  console.log(chalk.red(ex.stack));
}
