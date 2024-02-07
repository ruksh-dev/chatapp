const express=require('express');
const {createServer}=require('http');
const {Server}=require('socket.io');
const formtMessages=require('./utils/messages');
const {userJoin,getCurrentUser,userLeaves,getRoomUsers}=require('./utils/users');
const app=express();
const httpServer=createServer(app);
const io=new Server(httpServer);
const botName='Admin';
// run when client connects
io.on('connection',(socket)=>{
    socket.on('userRoom',({username,room})=>{
    //getting user
    const user=userJoin(socket.id,username,room);
        //join
    socket.join(user.room);
    //welcome current user
    //console.log("new ws connection made",socket.id);
    socket.emit('message',formtMessages(botName,'welome to chatcord nerds'));// to a particular client
    // broadcast when user connects(meaning to send everyone except itself)
    socket.broadcast.to(user.room).emit('message',formtMessages(botName,`${user.username} connected`));
    // send users and room info 
    io.sockets.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })  
    });
    // lstening chatMsg
    socket.on('chatMsg',(msg)=>{
        const user=getCurrentUser(socket.id);
        io.sockets.to(user.room).emit('message',formtMessages(user.username,msg));
    });
    // io.emit()
    // when user disconnects
    socket.on('disconnect',()=>{
        const user=userLeaves(socket.id);
        if(user){
        io.sockets.to(user.room).emit('message',formtMessages(botName,`${user.username} has left the chat`));
        }
        //
        io.sockets.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    }) 
    });

});
app.use(express.static('docs'));
const PORT=3000 || process.env.PORT;
httpServer.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});