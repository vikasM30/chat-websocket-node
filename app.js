const express = require('express');
const moment = require('moment');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000

const socketConnected = new Set()

const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', onConnected)

function onConnected(socket) {
    socketConnected.add(socket.id);
    io.emit('clients-total', socketConnected.size);
    socket.on('disconnect', () => {
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);
    });
    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('chat-feedback', data);
    });
}
