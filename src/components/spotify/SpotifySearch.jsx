import React, { useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { getToken, searchTracks } from "../../services/spotify/spotify"; // Importa las funciones necesaria

const SpotifySearch = ({ onSelectSong }) => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken();

      const results = await searchTracks(query, token);
      setTracks(results);
    } catch (err) {
      setError("Error fetching tracks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a song on Spotify"
          className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-3 py-2 bg-green-600 text-white rounded-lg"
        >
          <FaSpotify className="text-2xl" />
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {tracks.map((track) => (
          <li
            key={track.id}
            className="cursor-pointer mb-2"
            onClick={() => onSelectSong(track)}
          >
            {track.name} by {track.artists.map((artist) => artist.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifySearch;
