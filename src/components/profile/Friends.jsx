import React from "react";

// Componente Friends para mostrar la lista de amigos
const Friends = ({ friends }) => {
  return (
    <div>
      <h1>Amigos:</h1>
      {friends.map((friend) => (
        <h2 key={friend.id}>@{friend.name}</h2>
      ))}
    </div>
  );
};

export default Friends;
