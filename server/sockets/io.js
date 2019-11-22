module.exports = (http) => {
	const io = require('socket.io').listen(http);

	io.on('connection', (socket) => { 
		// When User renames Title, update the title.
		socket.on('renameTitle', (doc) => {
			io.emit('updateTitle', doc);
		});

		// When User updates the document, update the client side document.
		socket.on('changesToServerDocument', (doc) => {
			io.emit('updateClientDocument', doc);
		})
	});
};