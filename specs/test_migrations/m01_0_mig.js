'use strict';

module.exports = {
	name: '01_mig',
	up: async (db) => {
		await db.class.create('Test2', 'V');
	},
	down: async (db) => {
		await db.class.drop('Test2', 'V');
	},
};
