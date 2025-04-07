const dotenv = require('dotenv')
const app = require('./app')
const mongoose = require('mongoose')
const {Server} = require('socket.io')
const http = require('http')
const { v4: uuidv4 } = require('uuid');


dotenv.config(
    {
        path: `${__dirname}/config.env`
    }
)
const PORT = process.env.PORT
const LOCALDB = process.env.LOCALDB

const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Optional: allow cookies or authorization headers
  },
});

mongoose.connect(LOCALDB)
    .then(con=>console.log('DB connected'))
    .catch(err=>console.log(err))





io.on('connection', socket=>{
    console.log('a user connected', socket.id);
    socket.on("join:room", ({roomName})=>{
        socket.join(roomName)
        console.log('user joiend room')
    })    

    socket.on('message:send', async ({senderId, receiverId, name, message})=>{

        console.log(`room name is ${name}`)
        console.log('message:recieve is executed')

        const _id = uuidv4();
        io.to(name).emit('message:receive', {senderId, receiverId, name, message, _id})
    })

    socket.on("disconnect", ()=>{
        console.log(`User disconnected ${socket.id}`,)
    })
})

server.listen(PORT, ()=>{
    console.log("http://localhost:4000")
})