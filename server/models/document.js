const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a Document and schema
let Document = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	},
	starred: {
		type: Boolean
	},
}, { timestamps: true });

module.exports = mongoose.model('Document', Document);