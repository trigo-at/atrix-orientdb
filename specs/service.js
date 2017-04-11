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

const svc4 = new atrix.Service('orientdb4', {
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
					name: 'db4',
					username: 'root',
					password: 'password',
				},
				migrations: {
					dir: path.join(__dirname, './test_migrations'),
					runOnStartup: false,
				},
				createDb: true,
			},
		},
	},
});
atrix.addService(svc4);

const svc5 = new atrix.Service('orientdb5', {
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
					name: 'db5',
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
atrix.addService(svc5);

const svc6 = new atrix.Service('orientdb6', {
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
					name: 'db6',
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
atrix.addService(svc6);
