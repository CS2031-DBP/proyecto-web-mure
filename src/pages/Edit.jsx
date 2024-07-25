import React, { useEffect, useState } from "react";
import { editProfile } from "../services/profile/editProfile";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AddAPhoto } from "@mui/icons-material";
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
        setError("Error fetching user data.");
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
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center px-6 pt-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-bgColor p-6 rounded-xl w-full max-w-md grid grid-cols-1 gap-4 mt-28">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-2"
          encType="multipart/form-data"
        >
          <div className="flex flex-col items-center relative">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-buttonColor bg-white">
              <img
                src={imagePreviewUrl}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            {imagePreviewUrl !== oldData.profileImage && (
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-0 right-0 p-1 transition duration-300 transform mr-28 "
                title="Clear Image"
              >
                <Cancel style={{ fill: "#8E3356" }} />
              </button>
            )}
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 mr-28 transform translate-y-1/4 translate-x-1/2 cursor-pointer bg-buttonColor rounded-full p-2 transition duration-300 border border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white"
            >
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <AddAPhoto className="text-white" />
            </label>
          </div>
          <div className="col-span-1 relative">
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-left text-buttonColor"
            >
              Name
            </label>
          </div>
          <motion.input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={data.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-white border-buttonColor text-buttonColor focus:input-focus focus:outline-none focus:ring-1 focus:ring-buttonColor rounded-sm "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <div className="col-span-1">
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-buttonColor text-white rounded-lg transition duration-300 hover:bg-buttonHover"
            >
              Save Changes
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={() => navigate("/change-credentials")}
            className="w-full py-2 bg-buttonColor text-white rounded-lg transition duration-300 hover:bg-buttonHover"
          >
            Change Credentials
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Edit;
