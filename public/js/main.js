const socket = io();

const chatform = document.getElementById("chat-form");
const chatmsgs = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

//get username and room data from the url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
//console.log(username, room);

//joining chatroom
socket.emit("joinRoom", { username, room });

//get live users in room
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server
socket.on("message", message => {
  console.log(message);
  outputMessage(message);

  //scroll bar
  chatmsgs.scrollTop = chatmsgs.scrollHeight;
});

//posting message
chatform.addEventListener("submit", e => {
  e.preventDefault();

  //getting msg text
  const msg = e.target.elements.msg.value;

  //console.log(msg);
  //sending message to server
  socket.emit("chatmsg", msg);

  //reset input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//posting message in frontend
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//add room name
function outputRoomName(room) {
  roomName.innerText = room;
}

// add users to the room
function outputUsers(users) {
  usersList.innerHTML = `${users
    .map(user => `<li>${user.username}</li>`)
    .join("")}`;
}
