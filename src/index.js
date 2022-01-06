const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const Filter = require('bad-words')
const { genareteMessages, genaretelocationmessages } = require('./utilis/messages')
const { addUser, removeUsers, getUsers, getUserinroom } = require('./utilis/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicdirectoryname = path.join(__dirname, '../public')

app.use(express.static(publicdirectoryname))

// server(emit)-> client(receive) -> countupdated
// client(emit)-> server(receive) -> increment

io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    socket.on('join', (Options, callback) => {

        const { user, error } = addUser({ id: socket.id, ...Options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', genareteMessages('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', genareteMessages('Admin', `${user.username} has Joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserinroom(user.room)
        })

        callback()
    })

    socket.on('sendmessage', (message, callback) => {
        const oneuser = getUsers(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

       
        io.to(oneuser.room).emit('message', genareteMessages(oneuser.username, message))
        callback()
    })

    socket.on('sendLocation', (lct, callback) => {

        const oneuser = getUsers(socket.id)
        io.to(oneuser.room).emit('LocationMessage', genaretelocationmessages(oneuser.username, `https://google.com/maps?q=${lct.latitude},${lct.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUsers(socket.id)
        if (user) {
            io.to(user.room).emit('message', genareteMessages('Admin', `${user.username} has Left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserinroom(user.room)
            })
        }



    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})