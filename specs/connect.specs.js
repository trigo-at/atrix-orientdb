'use strict';

/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, arrow-body-style: 0 */

const { expect } = require('chai');

require('./service');
const atrix = require('@trigo/atrix');

describe('loads datasources into service', () => {
	beforeEach(async () => {
		await atrix.services.orientdb.start();
	});

	it('connect all and expose as service.dataConnections', async () => {
		expect(atrix.services.orientdb.dataConnections.m1).to.be.an('object');
	});

	it('expose "db" object', async () => {
		expect(atrix.services.orientdb.dataConnections.m1.getServer).to.be.an('function');
	});

	after(async () => {
		const server = atrix.services.orientdb.dataConnections.m1.getServer();
		const dbs = await server.list();
		await Promise.all(dbs.map(db => server.drop(db.name)));
		await server.close();
	});

	describe('db creation', () => {
		it('creates the database on startup', async () => {
			const server = atrix.services.orientdb.dataConnections.m1.getServer();
			const exists = await server.exists(atrix.services.orientdb.config.config.dataSource.m1.config.db.name);
			expect(exists).to.be.true;
			server.close();
		});

		it('throws on start when db does not exist but createDb == false', async () => {
			try {
				await atrix.services.orientdb2.start();
				throw new Error('Should hav thrown');
			} catch (e) {
				expect(e.message).to.contain('"ned-do"');
			}
		});
	});

	describe('migrations', () => {
		it('no error when no migrations config section is omitted', async () => {
			await atrix.services.orientdb3.start();
		});

		it('runs all migrations on startup when "config.db.migrations.runOnStartup = true"', async () => {
			const db = atrix.services.orientdb.dataConnections.m1.db;
			const Test = await db.class.get('Test');
			expect(Test).to.exist;
			const Test2 = await db.class.get('Test2');
			expect(Test2).to.exist;
		});
	});
});

