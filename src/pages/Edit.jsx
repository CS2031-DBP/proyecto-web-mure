import React, { useState } from "react";
import { editProfile } from "../services/profile/editProfile";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Editar Perfil</h1>
      <button onClick={() => navigate("/profile")} className="transition duration-300">Mi Perfil</button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <motion.input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handleChange}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />

        <label htmlFor="password">Contraseña</label>
        <motion.input
          type="password"
          id="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        <label htmlFor="email">Correo Electrónico</label>
        <motion.input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />

        <label htmlFor="profileImage">Imagen de Perfil</label>
        <motion.input
          type="text"
          id="profileImage"
          name="profileImage"
          value={data.profileImage}
          onChange={handleChange}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        <button type="submit">Guardar Cambios</button>
      </form>
    </motion.div>
  );
};

export default Edit;
