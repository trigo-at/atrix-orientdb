'use strict';

const ORIENT_DB_SYSTEM_CLASSES = [
    'E',
    'OFunction',
    'OIdentity',
    'ORestricted',
    'ORole',
    'OSchedule',
    'OSequence',
    'OTriggered',
    'OUser',
    'V',
];
const OrientDB = require('orientjs');
const bb = require('bluebird');
const Joi = require('joi');

const configSchema = Joi.object({
    server: Joi.object({
        host: Joi.string()
            .default('127.0.0.1')
            .description('host name of the OrientDB server'),
        port: Joi.number()
            .integer()
            .default(2424)
            .description('port used by OrientDB on the server'),
        username: Joi.string()
            .default('admin')
            .description('the username used to authenticate'),
        password: Joi.string()
            .default('admin')
            .description('the password used to authenticate'),
    })
        .required()
        .description('the server connection'),
    db: Joi.object({
        name: Joi.string()
            .required()
            .description('name of the databse to connect to'),
        username: Joi.string()
            .default('admin')
            .description('name of the user to authenticate with the database'),
        password: Joi.string()
            .default('admin')
            .description('the password used to authenticate with the databse'),
        type: Joi.string()
            .valid('graph', 'document')
            .default('graph')
            .description('the type of the database to create'),
        storage: Joi.string()
            .valid('memory', 'plocal')
            .default('plocal')
            .description('stlorage type to use for the created db'),
    })
        .required()
        .description('the database connection'),
    migrations: Joi.object({
        runOnStartup: Joi.boolean()
            .default(false)
            .description('wheter migration should be run on start up'),
        dir: Joi.string()
            .default('./migrations')
            .description('folder that contains the mgrations'),
    }).default({runOnStartup: false}),
    createDb: Joi.boolean()
        .default(false)
        .description('whenter to create the database if it not exists on startup'),
});

class AtrixOrientDb {
    constructor(atrix, service, config) {
        this.retries = {};
        this.atrix = atrix;
        this.service = service;
        this.log = this.service.log.child({plugin: 'AtrixOrientDb'});
        this.config = Joi.attempt(config, configSchema);
    }

    async start() {
        this.log.debug('start');
        this.connection = await this.connect();
        await this.testServer();
        await this.testDb();
        await this.autoMigrate();
        return this.connection;
    }

    async testServer() {
        const server = OrientDB(this.config.server);
        try {
            this.log.info(
                `try connecting to server OrientDB: "${this.config.server.username}@${this.config.server.host}:${
                    this.config.server.port
                }"`
            );
            await server.list();
            return true;
        } catch (e) {
            this.log.error(e);
            await bb.delay(200);
            return this.testServer();
        } finally {
            await server.close();
        }
    }

    async testDb() {
        this.log.info(`try connecting to OrientDB database: "${this.config.db.username}@${this.config.db.name}"`);
        const server = OrientDB(this.config.server);
        try {
            await server.list();
            const dbExists = await server.exists(this.config.db.name);
            if (!dbExists && this.config.createDb) {
                this.log.info(`creating database: "${this.config.db.name}"`);
                await server.create({
                    name: this.config.db.name,
                    type: this.config.db.type,
                    storage: this.config.db.storage,
                });
                this.log.info('databse created');
            } else if (!dbExists) {
                server.close();
                throw new Error(
                    `Can not connect to to database: "${
                        this.config.db.name
                    }". Set createDb: true to automatically create database on startup`
                );
            }
        } catch (e) {
            this.log.error(e);
            throw e;
        } finally {
            server.close();
        }
    }

    async autoMigrate() {
        if (!this.config.migrations.runOnStartup) {
            this.log.info('Migrations configured not to be run on start-up.');
            return;
        }
        await this.migrateUp();
    }

    async migrateUp() {
        const db = this.getDatabase();
        const manager = new OrientDB.Migration.Manager({
            db,
            dir: this.config.migrations.dir,
        });

        await manager.ensureStructure();
        const allMigs = await manager.listAvailable();
        this.log.info('Found migrations:', allMigs);

        const appliedMigs = await manager.listApplied();
        this.log.info('Already applied migrations:', appliedMigs);

        const missing = await manager.list();
        this.log.info('Applieing migrations:', missing);

        await manager.up();
        db.close();
        db.forceClose();
        this.log.info('All pending migrations have been applied.');
    }

    async connect() {
        this.log.debug('connect');

        this.service.events.on('stopping', async () => {
            this.log.info('Closing open OrientDB connection...');
            if (this.connection) {
                this.connection.db.close();
                this.connection.db.forceClose();
            }
        });

        return {
            getServer: () => OrientDB(this.config.server),
            db: this.getDatabase(),
            migrateUp: this.migrateUp.bind(this),
            resetDb: this.resetDb.bind(this),
        };
    }

    getDatabase() {
        return new OrientDB.ODatabase({
            host: this.config.server.host,
            port: this.config.server.port,
            username: this.config.db.username,
            password: this.config.db.password,
            name: this.config.db.name,
        });
    }

    async resetDb() {
        const db = this.getDatabase();
        const list = await db.class.list(true);
        for (const c of list.filter(cl => ORIENT_DB_SYSTEM_CLASSES.indexOf(cl.name) === -1)) {
            this.log.info(`TRUNCATE CLASS ${c.name} POLYMORPHIC UNSAFE`);
            await db.query(`TRUNCATE CLASS ${c.name} POLYMORPHIC UNSAFE`);
        }
        for (const c of list.filter(cl => ORIENT_DB_SYSTEM_CLASSES.indexOf(cl.name) === -1)) {
            if (c.superClass && c.superClass !== 'V' && c.superClass !== 'E') {
                this.log.info(`ALTER CLASS ${c.name} SUPERCLASS -${c.superClass}`);
                await db.query(`ALTER CLASS ${c.name} SUPERCLASS -${c.superClass}`);
            }
        }
        for (const c of list.filter(cl => ORIENT_DB_SYSTEM_CLASSES.indexOf(cl.name) === -1)) {
            this.log.info(`DROP CLASS ${c.name}`);
            await db.query(`DROP CLASS ${c.name}`);
        }
        db.close();
        db.forceClose();
    }
}

module.exports = AtrixOrientDb;
