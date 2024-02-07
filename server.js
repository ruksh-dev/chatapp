const express=require('express');
const {createServer}=require('http');
const {Server}=require('socket.io');
const formtMessages=require('./utils/messages');
const app=express();
const httpServer=createServer(app);
const io=new Server(httpServer);
const botName='Admin';
// run when client connects
io.on('connection',(socket)=>{
    //
    socket.on('userRoom',({username,room})=>{
    //welcome current user
    //console.log("new ws connection made",socket.id);
    socket.emit('message',formtMessages(botName,'welome to chatcord nerds'));// to a particular client
    // broadcast when user connects(meaning to send everyone except itself)
    socket.broadcast.emit('message',formtMessages(botName,'user connected'));    
    });
    // lstening chatMsg
    socket.on('chatMsg',(msg)=>{
        io.sockets.emit('message',formtMessages('USER',msg));
    });
    // io.emit()
    // when user disconnects
    socket.on('disconnect',()=>{
        io.sockets.emit('message',formtMessages(botName,'a user has left the chat'));
    });

});
app.use(express.static('public'));
const PORT=3000 || process.env.PORT;
httpServer.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});