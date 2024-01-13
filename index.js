import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost:3001", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    // Upon connection - only to user
    socket.emit('message', "Welcome to Chat App")

    // Upon connection - to all others except the user
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`)
    
    // Listening for a message event 
    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
    })

    // When user disconnects - to all others 
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.
        substring(0, 5)} disconnected`)
    })

    // Listen for activiry
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
})

