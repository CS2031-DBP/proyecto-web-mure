import React, { useState } from "react";
import { editProfile } from "../services/profile/editProfile";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    password: "",
    email: "",
    profileImage: "",
  });

  // Maneja los cambios en los campos del formulario y actualiza el estado
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga de la página al enviar el formulario

    // Crea un objeto con los datos a actualizar, excluyendo los campos vacíos
    const updateData = {};
    for (let key in data) {
      if (data[key]) {
        updateData[key] = data[key];
      }
    }

    try {
      const res = await editProfile(updateData); // Llama a la función de edición del perfil
      if (res.status === 204) {
        // Si la actualización incluye email o password, se cierra sesión
        if (updateData.email || updateData.password) {
          localStorage.removeItem("token"); // Elimina el token de autenticación
          navigate("/auth/login"); // Redirige a la página de inicio de sesión
        } else {
          navigate("/profile"); // Redirige a la página de perfil
        }
      }
    } catch (error) {
      console.error(error); // Manejo de errores
    }
  };

  return (
    <div>
      {/* Título de la página de edición de perfil */}
      <h1>Editar Perfil</h1>
      {/* Botón para navegar de regreso al perfil del usuario */}
      <button onClick={() => navigate("/profile")}>Mi Perfil</button>
      {/* Formulario para editar el perfil del usuario */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handleChange}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={data.password}
          onChange={handleChange}
        />

        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleChange}
        />

        <label htmlFor="profileImage">Imagen de Perfil</label>
        <input
          type="text"
          id="profileImage"
          name="profileImage"
          value={data.profileImage}
          onChange={handleChange}
        />

        {/* Botón para guardar los cambios del perfil */}
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default Edit;
