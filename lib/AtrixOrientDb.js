'use strict';

const OrientDB = require('orientjs');
const ODatabase = OrientDB.ODatabase;

class AtrixOrientDb {
	constructor(atrix, service, config) {
		this.retries = {};
		this.atrix = atrix;
		this.service = service;
		this.log = this.service.log.child({ plugin: 'AtrixOrientDb' });
		this.config = config;
	}

	async start() {
		this.log.info('start connection', this.config);
		this.server = OrientDB(this.config.server);
		return this.connect();
	}

	async connect() {
		this.log.info('connect:', this.config);
		return {
			getServer: () => OrientDB(this.config.server),
			db: new ODatabase({
				host: this.config.server.host,
				port: this.config.server.port,
				username: this.config.db.username,
				password: this.config.db.password,
				name: this.config.db.name,
			}),
		};
	}
}

module.exports = AtrixOrientDb;
