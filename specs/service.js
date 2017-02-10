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
			},
		},
	},
});
atrix.addService(svc);
