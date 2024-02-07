const chatForm=document.getElementById("chat-form");
const chatMessages=document.querySelector(".chat-messages");
// get username and room from url using qs 
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
const socket=io();
//
socket.emit('userRoom',{username,room});
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    // setting scroll bar to see chat 
    chatMessages.scrollTop=chatMessages.scrollHeight;
});
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    // emiting message to server
    socket.emit('chatMsg',msg);
    // clearing the chat bar and setting focus to it
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})
function outputMessage(msg){
    const div=document.createElement('div');
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${msg.username} <span>${msg.time}</span></p>
						<p class="text">
							${msg.text}
						</p>`;
    document.querySelector(".chat-messages").appendChild(div);                    

}