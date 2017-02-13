const pkg = require('../package.json');

const AtrixOrientDb = require('./AtrixOrientDb');

module.exports = {
	name: pkg.name,
	version: pkg.version,
	register: () => {},
	factory: (atrix, service, config) => new AtrixOrientDb(atrix, service, config),
};
