const envName = 'production';
process.env.BABEL_ENV = envName;
process.env.NODE_ENV = envName;
process.env.GENERATE_SOURCEMAP = false;

const configFactory = require('./webpackConfigFactory');
const paths = require('./utils/paths');

paths.copyPublicFolder();

module.exports = configFactory(envName);
