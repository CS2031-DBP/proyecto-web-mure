import React from "react";

// Componente ProfileInfo para mostrar información del perfil
const ProfileInfo = ({ data }) => {
  return (
    <div className="flex items-center py-10 px-40 bg-gray-800 rounded-lg shadow-lg ">
      <img
        src={data.profileImage}
        alt="profile"
        className="w-24 h-24 mr-4 rounded-full object-cover"
      />
      <div className="text-left">
        <h1 className="font-bold text-white ">{data.name}</h1>
        <h2 className="text-gray-400">Cumpleaños 🎉: {data.birthDate}</h2>
      </div>
    </div>
  );
};

export default ProfileInfo;