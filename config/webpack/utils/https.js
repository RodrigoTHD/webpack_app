module.exports.isHttpsConfig = function getHttpsConfig() {
  const { HTTPS } = process.env;
  const isHttps = HTTPS === 'true';
  return isHttps;
};
