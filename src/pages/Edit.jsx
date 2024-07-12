import React, { useEffect, useState } from "react";
import { editProfile } from "../services/profile/editProfile";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import Cancel from "@mui/icons-material/Cancel";

const Edit = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    profileImage: null,
  });
  const [oldData, setOldData] = useState({
    name: "",
    profileImage: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setData({
          name: user.data.name,
        });

        setOldData({
          name: user.data.name,
          profileImage: user.data.profileImageUrl,
        });

        setImagePreviewUrl(user.data.profileImageUrl);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setData({ ...data, profileImage: files[0] });
      setImagePreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleClearImage = () => {
    setData((prevData) => ({ ...prevData, profileImage: null }));
    URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(oldData.profileImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== null) {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await editProfile(formData);
      if (res.status === 204) {
        setSuccess("Profile updated successfully.");
        navigate("/user");
      }
    } catch (error) {
      setError("Error updating profile.");
      console.error(error);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-b from-spotify-black via-spotify-gray to-spotify-black p-7 rounded-lg shadow-lg w-80 max-w-4xl">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6"
          encType="multipart/form-data"
        >
          <div className="flex flex-col items-center mb-4">
            <div className="relative bg-white rounded-full p-3">
              <img
                src={imagePreviewUrl}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
              {imagePreviewUrl !== oldData.profileImage && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute top-0 right-0 p-1 transition duration-300"
                  title="Clear Image"
                >
                  <Cancel style={{ fill: "red" }} />
                </button>
              )}
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 cursor-pointer"
              >
                <div className="bg-transparent rounded-full p-2 transition duration-300 border border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white">
                  <EditIcon className="text-white" />
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
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-left labelLine"
            >
              Name
            </label>
            <motion.input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={data.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
          <div className="col-span-1">
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-ver text-white rounded-lg transition duration-300 bg-color4 hover:bg-color3"
            >
              Save Changes
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={() => navigate("/change-credentials")}
            className="w-full py-2 bg-ver text-white rounded-lg transition duration-300 bg-color4 hover:bg-color3"
          >
            Change Credentials
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Edit;
