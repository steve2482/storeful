exports.DATABASE_URL = process.env.DATABASE_URL ||
					             global.DATABASE_URL ||
					             'mongodb://storful82:instock@ds151078.mlab.com:51078/storeful';
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
  'mongodb://localhost/storeful-test-db');
exports.PORT = process.env.PORT || 8080;
