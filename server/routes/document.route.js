const express = require('express');
const app = express();

const documentRoute = express.Router();

// Models
let Document = require('../models/document');

// Create a Document.
documentRoute.route('/documents').post((req, res) => {
	Document.create(req.body, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.json(data);
		}
	})
})

// Get a document by the _id.
documentRoute.route('/documents/:id').get((req, res) => {
	Document.findOne({ _id: req.params.id }, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.json(data);
		}
	})
})

// Get all documents.
documentRoute.route('/documents').get((req, res) => {
	Document.find({}, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.json(data);
		}
	})
})

// Update a document.
documentRoute.route('/documents/:id').patch((req, res) => {
	Document.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.json(data);
		}
	})
}) 

// Delete selected document.
documentRoute.route('/documents/:id').delete((req, res) => {
	Document.findOneAndDelete({ _id: req.params.id }, (err, data) => {
		if (err) {
			return next(err);
		} else {
			res.status(200).json({
				msg: data,
			});
		}
	})
})

module.exports = documentRoute;