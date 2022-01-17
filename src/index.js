const path=require('path');
const express=require('express');
const http=require('http');
const socketio=require('socket.io');

const app=express();
const server=http.createServer(app);
//providing raw server to socketio
const io=socketio(server);

const publicDirectoryPath=path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

const port=process.env.PORT||3000;
// players for player information and unmatched for selecting opponent
let players={};
let unmatched;

function handleJoin(socket){
    players[socket.id]={
        opponent:unmatched,
        symbol:'X',
        socket
    };
    //unmatched variable will be null when there is already two player required for playing the game other wise it will contain the socket id of player who joined first
    if(unmatched){
        players[socket.id].symbol='0';
        players[unmatched].opponent=socket.id;
        unmatched=null;
    }else{
        unmatched=socket.id;
    }
}
//function will return opponent's socket if opponent is available
function opponent(socket){
    if(!players[socket.id].opponent) return;
    return players[players[socket.id].opponent].socket;
}
io.on('connection',(socket)=>{
    console.log('new webSocket connection');
    handleJoin(socket);
    //if opponent is available then only we can play the game
    if(opponent(socket)){
        socket.emit('gameBegin',players[socket.id].symbol);
        opponent(socket).emit('gameBegin',players[opponent(socket).id].symbol);
    }
    socket.on('makeMove',(data)=>{
        if(!opponent(socket)) return;
        socket.emit('moveMade',data);
        opponent(socket).emit('moveMade',data);
    })

    socket.on("disconnect", (socket) => {
        io.emit("message", "A user left");
      });
})
server.listen(port,()=>{
    console.log(`server is up on ${port}`);
})