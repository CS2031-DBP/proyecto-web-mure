# Mure: Share Your Music Taste 🎧 🎶

**Mure**, the winner of the *Berners Lee Award 2024-1* for the UTEC course *Platform-Based Development* (CS2031), is a platform designed for users to share their music preferences with friends and followers. With Mure, you can create and share posts, playlists, and explore music content 🎙️.

This repository contains the source code for the web frontend of the project, developed with React ⚛️. For the backend and mobile frontend, please refer to the following repositories:

- **Backend**: [Mure Backend Repository](https://github.com/CS2031-DBP/proyecto-backend-mure.git)
- **Frontend Mobile**: [Mure Frontend Mobile Repository](https://github.com/CS2031-DBP/proyecto-mobile-mure.git)

## Project Members 🤝

| Name              | GitHub User                                              |  Email                                                                |
|-------------------|----------------------------------------------------------|-----------------------------------------------------------------------|
| Joaquin Salinas   | [joaquinsalinas06](https://github.com/joaquinsalinas06)  |[joaquin.salinas@utec.edu.pe](mailto:joaquin.salinas@utec.edu.pe)      |
| Guillermo Galvez  | [KarTaGo124](https://github.com/KarTaGo124)              |[jose.galvez.p@utec.edu.pe](mailto:jose.galvez.p@utec.edu.pe)          |
| Alejandro Escobar | [AlejandroEN](https://github.com/AlejandroEN )           |[alejandro.escobar@utec.edu.pe](mailto:alejandro.escobar@utec.edu.pe)  |

## Prerequisites 🔧

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: Latest version
- **Backend**: You'll need to run the backend before using the app. Use the following repository: [Mure Backend](https://github.com/CS2031-DBP/proyecto-backend-mure). Also, if you don't use "localhost:8080" to communicate with your local API, feel free to change it in the `services/api.js` file to match your URL.

## Getting Started 🚀

To set up the project on your local machine, follow these steps:

1. **Clone the Repository**

   Open your terminal and clone the repository using the following command:

   ```sh
   git clone https://github.com/CS2031-DBP/proyecto-web-mure
   ```

2. **Navigate to the Project Directory**

   Change to the project directory:

   ```sh
   cd proyecto-web-mure
   ```

3. **Install Dependencies**

   Install the necessary dependencies:

   ```sh
   npm install
   ```

4. **Set Up Environment Variables**

   Create a Spotify Developer account and create an app with at least the Web API and Web Playback SDK. Obtain your client ID and client secret, then define them in the `.env` file in the root of your project. This will enable the functionality to search and play songs from Spotify if the user is an admin.

   ```plaintext
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

5. **Start the Application**

   Start the application using the following command:

   ```sh
   npm run dev
   ```

## Project Structure 🏗️

### Frontend 🌐

- **Framework**: React ⚛️
- **Libraries**:
  - **Material-UI (MUI)**
  - **Axios**
  - **Framer Motion**
  - **JWT Decode**
  - **Moment**
  - **React Icons**
  - **React Player**
  - **React Router DOM**
  - **Standardized Audio Context**
- **Styling**: Tailwind CSS 🌈

## Main Pages 📄

### Login 🔑

Login page to authenticate users using email and password, redirecting to the dashboard upon successful authentication.

### Register 📝

Registration page for new users, allowing account creation with username, email, password, and birthday.

### Dashboard 🏠

Main page after logging in, showing a feed of posts from all users. Allows interaction with posts and continuous content loading via "Infinite Scroll."

### SongView 🎵

Allows exploring all songs available in the database, with search options by title, genre, or artist name.

### Add Song ➕🎶

Allows administrators to add a new song to the database by searching and selecting artists and providing details like title, release date, genre, duration, cover image, and Spotify link.

### Spotify Create 🔍🎧

Makes it easy to search for songs on Spotify using the Spotify API. Administrators can select songs, and the page and backend verify if the song's artists are already in the database. If not, it redirects to "Add Artist Info."

### Add Artist Info ➕🎤

This page is used to add additional information about artists not present in the database before adding a new song. Here, data such as birthdate and a brief description are completed.

### Create Post ➕📝

Allows users to create posts with descriptions, images, and the ability to add information about a song or album, promoting social interaction on the platform. Additionally, users can search for a song using Song View and add it directly to a post.

### User Profile 👤

Shows information about a user, including their posts and playlists. Allows other users to view the profile, add or remove friends. For the current user, it allows editing the profile, viewing the friends list, and managing posts and playlists.

### Edit Profile ✏️

Allows users to edit their profile, including name and profile picture, keeping the information up to date.

### Change Credentials ⚔

Allows users to change their password or their email, redirecting them to the login page to use their new credentials.

### User Playlist Page 📃

View where users can watch either their playlists or other user playlists, depending on where they requested the playlist to be shown.

### Create Playlist ➕📋

Allows users to create new playlists, search for songs by title, and add them to their playlist, entering the playlist name and listing the added songs.

### Edit Playlist 📝📋

Allows modifying existing playlists by adding or removing songs.

### Playlist Page 📃

Shows a simple view of the selected playlist, allowing to play songs if they have a "preview link".

### Album View 💿

Similar to the playlist page, shows a simple view of the selected album, including all the songs of the album, and allowing the users to play it in the app if there is a "preview link".

### Friend List 👥

Shows the current user's friends list, allowing viewing of their profiles, removing friends, and navigating to individual profiles.

### NotFound ❓

404 error page displayed when a user tries to access a non-existent route, offering options to redirect to login or dashboard.

## Relevant Services 🛠️

### Authentication and Users 🔒

Handles user authentication and management through services that communicate with the backend to validate credentials, create new accounts, and retrieve information about the current user or other users. Additionally, users can update their personal information such as name, email, and profile picture through the "Edit" or "Change Credentials" pages.

### Music and Artists 🎤🎵

Manages music and artists by allowing the search of albums and artists in the database, as well as the creation of new records. Facilitates the addition of new songs, including details such as title, artists, release date, genre, duration, and links to external platforms.

### Playlists 📋

For managing playlists, our services allow creating new playlists, retrieving specific playlists by ID, getting the current user's playlists, and the playlists of other users. Also provides functionalities for adding and removing songs within a playlist.

### Posts 📝

Posts on our platform are managed through services that allow creating new posts, retrieving global posts, and user-specific posts, with options to like or dislike them. Posts are divided into two parts: one containing musical information and the other the post details. In the post information, users can either play the song in the app, go to an album view and listen to some songs, or go to Spotify to enjoy anything they like! Also offers functionality to delete posts, ensuring users have full control over their content.

### Social Interaction 💬

Promotes social interaction between users through services that manage friendship relationships, adding or removing friends, and verifying friendship status. Additionally, users can interact with posts through likes and dislikes, creating a more engaging and participatory experience.

## Acknowledgments 🫶

We would like to thank everyone who supported the project by testing it and providing valuable feedback. Special thanks to our professor, Jorge Rios, whose guidance and encouragement were crucial to the successful development of this project 🗣️ 🙌

## License 📄

This project is licensed under the [GNU General Public License v3.0](http://www.gnu.org/licenses/gpl-3.0.html).
