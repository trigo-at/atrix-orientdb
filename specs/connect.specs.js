'use strict';

/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0, arrow-body-style: 0 */

const {expect} = require('chai');

require('./service');
const atrix = require('@trigo/atrix');

describe('loads datasources into service', () => {
    before(async () => {
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
        server.close();
        atrix.services.orientdb.stop();
        atrix.services.orientdb2.stop();
        atrix.services.orientdb3.stop();
        atrix.services.orientdb4.stop();
        atrix.services.orientdb5.stop();
        atrix.services.orientdb6.stop();
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

        it('can run migrations manually', async () => {
            await atrix.services.orientdb4.start();
            const db = atrix.services.orientdb4.dataConnections.m1.db;
            await atrix.services.orientdb4.dataConnections.m1.migrateUp();
            const Test = await db.class.get('Test');
            expect(Test).to.exist;
        });
    });

    describe('can clear complete database', () => {
        it('clears all', async () => {
            await atrix.services.orientdb5.start();
            const db = atrix.services.orientdb5.dataConnections.m1.db;
            await db.class.create('TestSub', 'Test');
            await atrix.services.orientdb5.dataConnections.m1.resetDb();
            const list = await db.class.list(true);
            for (const c of list) {
                expect(c.name).not.to.equal('Test');
                expect(c.name).not.to.equal('Test2');
            }
        });

        it('can clear & migrateUp', async () => {
            await atrix.services.orientdb6.start();
            const db = atrix.services.orientdb6.dataConnections.m1.db;
            await atrix.services.orientdb6.dataConnections.m1.resetDb();
            await atrix.services.orientdb6.dataConnections.m1.migrateUp();
            const Test = await db.class.get('Test');
            expect(Test).to.exist;
        });
    });
});
