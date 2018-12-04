'use strict';

const atrix = require('@trigo/atrix');
const path = require('path');

atrix.configure({pluginMap: {orientdb: path.join(__dirname, '../')}});

atrix.addService({
    name: 'orientdb',
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

atrix.addService({
    name: 'orientdb2',
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
atrix.addService({
    name: 'orientdb3',
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

atrix.addService({
    name: 'orientdb4',
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

atrix.addService({
    name: 'orientdb5',
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

atrix.addService({
    name: 'orientdb6',
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
