'use strict';

const OrientDB = require('orientjs');
const bb = require('bluebird');
const Joi = require('joi');

const configSchema = Joi.object({
	server: Joi.object({
		host: Joi.string().default('127.0.0.1').description('host name of the OrientDB server'),
		port: Joi.number().integer().default(2424).description('port used by OrientDB on the server'),
		username: Joi.string().default('admin').description('the username used to authenticate'),
		password: Joi.string().default('admin').description('the password used to authenticate'),
	}).required().description('the server connection'),
	db: Joi.object({
		name: Joi.string().required().description('name of the databse to connect to'),
		username: Joi.string().default('admin').description('name of the user to authenticate with the database'),
		password: Joi.string().default('admin').description('the password used to authenticate with the databse'),
	}).required().description('the database connection'),
});

class AtrixOrientDb {
	constructor(atrix, service, config) {
		this.retries = {};
		this.atrix = atrix;
		this.service = service;
		this.log = this.service.log.child({ plugin: 'AtrixOrientDb' });
		this.config = Joi.attempt(config, configSchema);
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
