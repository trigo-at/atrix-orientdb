'use strict';

module.exports = {
	up: async (db) => {
		await db.class.create('Test2', 'V');
	},
	down: async (db) => {
		await db.class.drop('Test2', 'V');
	},
};
