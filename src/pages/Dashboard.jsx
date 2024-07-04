import React, { useEffect, useState, useRef, useCallback } from "react";
import Post from "../components/post/Post";
import { fetchPosts } from "../services/posts/getAllPosts";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // Estado para almacenar los posts
  const [page, setPage] = useState(0); // Estado para manejar la paginación
  const [size, setSize] = useState(7); // Estado para definir el tamaño de la página
  const [currUserName, setCurrUserName] = useState(""); // Estado para el nombre del usuario actual
  const [currId, setCurrId] = useState(""); // Estado para el ID del usuario actual
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar el estado de carga
  const [hasMore, setHasMore] = useState(true); // Estado para indicar si hay más posts por cargar
  const observer = useRef(); // Referencia para el observador de intersección

  // Función para cargar los posts desde el servidor
  const loadPosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await fetchPosts(page, size); // Llamada a la API para obtener los posts
      if (res.status === 200) {
        setPosts((prevPosts) => [...prevPosts, ...res.data.content]); // Agrega los nuevos posts al estado
        setPage((prevPage) => prevPage + 1); // Incrementa el número de página
        if (res.data.content.length === 0) {
          setHasMore(false); // Si no hay más posts, actualiza el estado
        }
      }
    } catch (error) {
      console.error(error); // Manejo de errores
    }
    setIsLoading(false);
  };

  // Función para obtener el nombre del usuario actual
  const fetchUserName = async () => {
    try {
      const res = await fetchCurrentUser(); // Llamada a la API para obtener la información del usuario
      if (res.status === 200) {
        setCurrUserName(res.data.name); // Actualiza el nombre del usuario en el estado
        setCurrId(res.data.id); // Actualiza el ID del usuario en el estado
      }
    } catch (error) {
      console.error(error); // Manejo de errores
    }
  };

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    fetchUserName();
    loadPosts();
  }, []);

  // Callback para manejar la observación del último elemento
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Efecto para limpiar el observador cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Contenedor principal con scrollbar oculto */}
      <div className="hide-scrollbar overflow-auto w-100px  h-[calc(100vh-150px)]">
        <ul>
          {/* Mapeo de los posts */}
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              // Si es el último post, se asigna la referencia para la carga infinita
              return (
                <Post
                  ref={lastPostElementRef}
                  key={post.id}
                  post={post}
                  currUserName={currUserName}
                  currId={currId}
                />
              );
            } else {
              // Para los demás posts
              return (
                <Post
                  key={post.id}
                  post={post}
                  currUserName={currUserName}
                  currId={currId}
                />
              );
            }
          })}
        </ul>
              {/* Mensajes de carga y fin de posts */}
        {isLoading && <p className="text-center mt-4">Loading...</p>}
        {!hasMore && <p className="text-center mt-4">No more posts</p>}
      </div>

    </div>
  );
};

export default Dashboard;
