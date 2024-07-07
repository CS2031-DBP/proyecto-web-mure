  import React, { useEffect, useState } from "react";
  import { editProfile } from "../services/profile/editProfile";
  import { fetchCurrentUser } from "../services/profile/getUserInfo";
  import { useNavigate } from "react-router-dom";
  import { motion } from 'framer-motion';
  import EditIcon from '@mui/icons-material/Edit';

  const Edit = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
      name: "",
      email: "",
      profileImage: "",
    });
    const [error, setError] = useState(""); // Añadido para manejar errores
    const [success, setSuccess] = useState(""); // Añadido para manejar mensajes de éxito

    useEffect(() => {
      const getCurrentUser = async () => {
        try {
          const user = await fetchCurrentUser();
          console.log(user);
          setData({
            name: user.data.name,
            email: user.data.email,
            profileImage: user.data.profileImage,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      getCurrentUser();
    }, []);

    // Maneja los cambios en los campos del formulario y actualiza el estado
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files && files[0]) {
        setData({ ...data, profileImage: files[0] });
      } else {
        setData({
          ...data,
          [name]: value,
        });
      }
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
          setSuccess("Perfil actualizado con éxito.");
          navigate("/profile"); // Redirige a la página de perfil
        }
      } catch (error) {
        setError("Error al actualizar el perfil."); // Manejo de errores
        console.error(error); // Log del error para debugging
      }
    };

    return (
      <motion.div
        className="flex items-center justify-center   "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-b from-spotify-black via-spotify-gray to-spotify-black p-7 rounded-lg shadow-lg w-80 max-w-4xl">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="flex flex-col items-center mb-4">
              <div className="relative bg-white rounded-full p-6">
                <img
                  src={data.profileImage}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full"
                />
                  <label htmlFor="profileImage" className="absolute bottom-0 right-0 cursor-pointer">
                  <div className=" bg-transparent rounded-full p-2  transition duration-300border border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white">
                    <EditIcon className="text-white " />
                  </div>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
              </div>
            </div>
            <div className="col-span-1 relative">
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-left labelLine">
                Nombre
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                placeholder="Nombre"
                value={data.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
            <div className="col-span-1 relative">
              <label htmlFor="email" className="block text-sm font-light mb-1 text-left labelLine">
                Correo Electrónico
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                placeholder="Correo Electronico"
                value={data.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

            

            <div className="col-span-1">
              <label className="block text-sm font-light mb-1 text-left labelLine" >Contraseña antigua </label>
              <motion.input
                type="password"
                id=" "
                name="  "
                placeholder="Old Password"
                value={data.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

              <div className="col-span-1">
              <label className="block text-sm font-light mb-1 text-left labelLine">Contraseña nueva </label>
              <motion.input
                type="password"
                id=" "
                name=" "
                placeholder="New Password"
                value={data.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>

            <div className="col-span-1 ">
              <button 
                type="submit" 
                className="w-full py-2 mt-4 bg-ver text-white rounded-lg transition duration-300 bg-color4 hover:bg-color3"
              >
                Guardar Cambios
              </button>
            </div>
          </form>

          <div className="mt-4">
            <button 
              onClick={() => navigate("/profile")}
              className="w-full py-2 bg-ver text-white rounded-lg transition duration-300 bg-color4 hover:bg-color3"
            >
              Regresar al Perfil
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  export default Edit;
