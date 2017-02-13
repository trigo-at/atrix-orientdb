'use strict';

const atrix = require('@trigo/atrix');
const path = require('path');

atrix.configure({ pluginMap: { orientdb: path.join(__dirname, '../') } });

const svc = new atrix.Service('orientdb', {
	dataSource: {
		m1: {
			type: 'orientdb',
			config: {
				server: {
					host: '127.0.0.1',
					port: 2424,
					username: 'root',
					password: 'password',
				},
				db: {
					name: 'atrix-orientdb-test',
					username: 'root',
					password: 'password',
				},
				migrations: {
					dir: path.join(__dirname, './test_migrations'),
					runOnStartup: true,
				},
				createDb: true,
			},
		},
	},
});
atrix.addService(svc);

const svc2 = new atrix.Service('orientdb2', {
	dataSource: {
		m1: {
			type: 'orientdb',
			config: {
				server: {
					host: '127.0.0.1',
					port: 2424,
					username: 'root',
					password: 'password',
				},
				db: {
					name: 'ned-do',
					username: 'root',
					password: 'password',
				},
				migrations: {
					dir: path.join(__dirname, './test_migrations'),
					runOnStartup: true,
				},
				createDb: false,
			},
		},
	},
});
atrix.addService(svc2);
const svc3 = new atrix.Service('orientdb3', {
	dataSource: {
		m1: {
			type: 'orientdb',
			config: {
				server: {
					host: '127.0.0.1',
					port: 2424,
					username: 'root',
					password: 'password',
				},
				db: {
					name: 'andere',
					username: 'root',
					password: 'password',
				},
				createDb: true,
			},
		},
	},
});
atrix.addService(svc3);
