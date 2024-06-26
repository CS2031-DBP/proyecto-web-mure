import React from 'react';

const ProfileInfo = ({ data }) => {
  console.log(data);
  return (
    <div>
      <h1>Perfil de {data.name}</h1>
      <img src={data.profileImage} alt="profile" width={50} height={50} />
      <h2>Nombre de Usuario: {data.name}</h2>
      <h2>Cumpleaños 🎉: {data.birthDate}</h2>
    </div>
  );
}

export default ProfileInfo;
