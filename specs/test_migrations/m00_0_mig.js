'use strict';

module.exports = {
    up: async db => {
        await db.class.create('Test', 'V');
    },
    down: async db => {
        await db.class.drop('Test', 'V');
    },
};
