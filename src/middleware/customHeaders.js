module.exports = (_req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With,'
      + ' Content-Type, Accept,'
      + ' Authorization,'
      + ' Access-Control-Allow-Credentials',
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  // NOTE: can be done using helmet.contentSecurityPolicy
  res.header(
    'Content-Security-Policy',
    'default-src \'self\';'
      + 'base-uri \'self\';'
      + 'block-all-mixed-content;'
      + 'font-src \'self\' https: data:;'
      + 'form-action \'self\';'
      + 'frame-ancestors \'self\';'
      + 'img-src * data:;'
      + 'object-src \'none\';'
      + 'script-src \'self\' cdn.jsdelivr.net;'
      + 'script-src-attr \'none\';'
      + 'style-src \'self\' https: \'unsafe-inline\';'
      + 'upgrade-insecure-requests',
  );

  next();
};
