const users = [];

//join user to chat base
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

//get the current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//user leaves the room
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get users in the room
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}
module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
