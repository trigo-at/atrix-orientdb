'use strict';

/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, arrow-body-style: 0 */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const OrientDB = require('orientjs');

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

	beforeEach(async () => {
		const server = atrix.services.orientdb.dataConnections.m1.getServer();
		const dbs = await server.list();
		await Promise.all(dbs.map(db => server.drop(db.name)));
		await server.close();
	});

	it('can create a new databse using a server instance', async () => {
		const server = atrix.services.orientdb.dataConnections.m1.getServer();
		const db = await server.create({
			name: 'atrix-orientdb-test',
			type: 'graph',
			storage: 'memory',
		});
		expect(db).to.be.an.instanceof(OrientDB.Db);
		await server.close();
	});
});

