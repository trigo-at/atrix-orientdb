'use strict';

const OrientDB = require('orientjs');
const bb = require('bluebird');

class AtrixOrientDb {
	constructor(atrix, service, config) {
		this.retries = {};
		this.atrix = atrix;
		this.service = service;
		this.log = this.service.log.child({ plugin: 'AtrixOrientDb' });
		this.config = config;
	}

	async start() {
		this.log.debug('start');
		const ret = await this.connect();
		await this.test();
		return ret;
	}

	async test() {
		try {
			this.log.info(`try connecting to server OrientDB: "${this.config.server.username}@${this.config.server.host}:${this.config.server.port}"`);
			const server = OrientDB(this.config.server);
			await server.list();
			await server.close();
			return true;
		} catch (e) {
			await bb.delay(200);
			return this.test();
		}
	}

	async connect() {
		this.log.debug('connect');
		return {
			getServer: () => OrientDB(this.config.server),
			db: new OrientDB.ODatabase({
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
