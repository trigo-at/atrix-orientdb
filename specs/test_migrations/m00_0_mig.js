'use strict';

module.exports = {
	name: '00_mig',
	up: async (db) => {
		await db.class.create('Test', 'V');
	},
	down: async (db) => {
		await db.class.drop('Test', 'V');
	},
};
