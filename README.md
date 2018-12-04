# atrix-orientdb

[![Greenkeeper badge](https://badges.greenkeeper.io/trigo-at/atrix-orientdb.svg?token=61447d7ba15c98714bd56df580c26be79624bd144d9d800aae995c246bc32f22)](https://greenkeeper.io/)
[![NSP Status](https://nodesecurity.io/orgs/trigo-gmbh/projects/8e8b83fd-045e-40a0-b98e-47bffadc966b/badge)](https://nodesecurity.io/orgs/trigo-gmbh/projects/8e8b83fd-045e-40a0-b98e-47bffadc966b)

## About

Plugin for the atrix mircoservice framework to setup OrientDB connections

## Compatibility

`atrix-orientdb < 1.0.0` works with `atrix < 6.0.0`
`atrix-orientdb >= 1.0.0` works with `atrix >= 6.0.0`

## Features

* Connection setup (server & database)
* Tests connection on startup
* Can create database on startup 
* Can run migrations on startup

## Installation
```bash
# install atrix framework
npm install -S @trigo/atrix

# install atrix-swagger plugin
nom install -S @trigo/atrix-orientdb
```

## Usage & Configuration

### test_migrations/m00_0_mig,js
**NOTE: Migration filenames mut match the regex: /^m(\d+)_(\d+)\_(.*)\.js$/**
```javascript
'use strict';

module.exports = {
	// setup code
	up: async (db) => {
		await db.class.create('Test', 'V');
	},
	// teardown code
	down: async (db) => {
		await db.class.drop('Test', 'V');
	},
};
```

### index.js
```javascript
'use strict';

const atrix = require('@trigo/atrix');
const path = require('path');

const svc = atrix.addService({
	// name of the service
	name: 'orientdb', 
	// configure the datasource
	//
	// driver can be found here: https://github.com/orientechnologies/orientjs
	dataSource: {
		// name of the connection
		//
		// after service startup access OrientJS Database object instance using property:
		//    const db = atrix.services.orientdb.dataConnections.m1.db -> (OrientJS Database instance)
		// to get an instace of the Server class use:
		//    const server = atrix.services.orientdb.dataConnections.m1.getServer() -> (OrientJS Server instance)
		// Note: call server.close() after usage to free resources on the server!
		//
		// to reset the database (delete all recors & classes) call 
		//	  atrix.services.orientdb.dataConnections.m1.resetDb();	
		// to manually run migrations call:
		//	  atrix.services.orientdb.dataConnections.m1.migrateUp();	
		m1: {
			// type of the db eg. plugin selection
			type: 'orientdb',
			config: {
				// server location & credentials
 				server: {
					// host where OrientDB runs
					host: '127.0.0.1',
					
					// port on which OrientDB is listening
					port: 2424,
					
					// username to authenticate with
					username: 'root',
					
					// password to authenticate with
					password: 'password',
				},
				
				// database name & credentials
				db: {
					// name of the database to use
					name: 'atrix-orientdb-test',
					
					// username to authenticate with
					username: 'root',
					
					// password to authenticate with
					password: 'password',
				},
				
				// configure migrations (optional)
				migrations: {
					// full path to the folder containing the migration files
					dir: path.join(__dirname, './test_migrations'),
					
					// wheter to run migrations on startup
					runOnStartup: true,
				},
				// wheter to create the database on startup when it does not exit
				createDb: true,
			},
		},
	},
});

// start the service
svc.start();
```
