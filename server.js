const express =require('express')
const app=express()
const server=require('http').Server(app)
const{ v4:uuidv4}=require('uuid')
const io=require('socket.io')(server)
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
    debug:true
})
// These lines import the necessary modules: Express for the web framework, and the HTTP module to create an HTTP server. It also imports the uuid library to generate unique identifiers.


app.set('view engine','ejs')
// This line sets EJS (Embedded JavaScript) as the view engine for rendering dynamic content.
app.use(express.static('public'))
// This line serves static files (like stylesheets or images) from the "public" directory.

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})
// /:room is a route with a dynamic parameter :room that matches any URL path with a single segment and captures that segment's value as req.params.room.
// This route handler responds to requests with a dynamic room parameter (e.g., '/some-room-id') and renders the 'room' view (presumably an EJS template) with the roomId passed as a parameter.

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId)
        
})
})
server.listen(3030)