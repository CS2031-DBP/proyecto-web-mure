import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth/auth";
import logo from "../img/Logo_Fondo-removebg-preview.png";

const Register = () => {
  // Hook de navegación para redirigir a diferentes rutas
  const navigate = useNavigate();

  // Hook de estado para almacenar los datos del formulario de registro
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    birthdate: "",
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
    try {
      const res = await register(data); // Llama a la función de registro
      if (res.status === 200) {
        // Si el registro es exitoso, guarda el token en el almacenamiento local
        localStorage.setItem("token", res.data.token);
        // Redirige al usuario al dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error); // Manejo de errores
    }
  };

  return (
    <div className="bg-black p-8 rounded-lg shadow-lg w-full">
      {/* En esta sección mostramos el logo de la aplicación */}
      <div className="bg-black w-72 rounded-lg shadow-lg max-w-md">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-20 h-20" />
        <div className="text-center mb-6 w-full max-w-md">
          {/* Aquí tenemos el título del formulario */}
          <h1 className="text-3xl font-semibold text-white">
            Sign Up for Mure
          </h1>
        </div>
        {/* Este es el formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* Campo de entrada para el correo electrónico */}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white text-left"
            >
              Correo
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
            />
          </div>
          <div>
            {/* Campo de entrada para la contraseña */}
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white text-left"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
            />
          </div>
          <div>
            {/* Campo de entrada para el nombre del usuario */}
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white text-left"
            >
              Usuario
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
            />
          </div>
          <div>
            {/* Campo de entrada para la fecha de cumpleaños */}
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-white text-left"
            >
              Fecha de Cumpleaños
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border border-white bg-black text-white focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
            />
          </div>
          <div>
            {/* Botón de envío del formulario */}
            <button
              type="submit"
              className="w-full bg-color3 text-white py-2 px-4 rounded-full font-semibold hover:bg-color4 focus:outline-none focus:ring-2 focus:ring-color4"
            >
              Registrarse
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm text-white">
          {/* Enlace para iniciar sesión si el usuario ya tiene una cuenta */}
          <span>Already have an account? </span>
          <a
            onClick={() => navigate("/auth/login")}
            className="font-medium hover:text-color2 text-white underline"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
