# Mure: Share Your Music Taste 🎧 🎶
___

**Mure**, the winner of the *Berners Lee Award 2024-1* for the UTEC course *Platform-Based Development* (CS2031), is a platform designed for users to share their music preferences with friends and followers. With Mure, you can create and share posts, playlists, and explore music content 🎙️

The project is developed using **Java and Spring Boot 🌱** for the backend, while the frontend is built with **React ⚛️**, and the mobile application is developed with **React Native 📱**

## Project Members 🤝
___
| Name              | Email                                                               |
|-------------------|---------------------------------------------------------------------|
| Joaquin Salinas   | [joaquin.salinas@utec.edu.pe](mailto:joaquin.salinas@utec.edu.pe)   |
| Guillermo Galvez  | [jose.galvez.p@utec.edu.pe](mailto:jose.galvez.p@utec.edu.pe)       |
| Alejandro Escobar | [alejandro.escobar@utec.edu.pe](mailto:alejandro.escobar@utec.edu.pe)|

## Prerequisites 🔧
___
Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: Latest version

## Getting Started 🚀
___

To set up the project on your local machine, follow these steps:

1. **Clone the Repository**

   Open your terminal and clone the repository using the following command:

   ```sh
   git clone <https://github.com/CS2031-DBP/proyecto-web-mure>
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

Create a Spotify Developer account and create an app with at least the Web API and Web Playback SDK. Obtain your client ID and client secret, then define them in the `.env` file in the root of your project. This will enable the functionality to search and play songs from Spotify if the user in an Admin.

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

### Create Spotify 🔍🎧

Makes easy to search for songs on Spotify using the Spotify API. Administrators can select songs, and the page and backend verify if the song's artists are already in the database. If not, it redirects to "Add Artist Info."

### Add Artist Info ➕🎤

This page is used to add additional information about artists not present in the database before adding a new song. Here, data such as birthdate and a brief description are completed.

### Create Post ➕📝

Allows users to create posts with descriptions, images, and the ability to add information about a song or album, promoting social interaction on the platform. Additionally, users can search for a song using Song View and add it directly to a post.

### User Profile 👤

Shows information about a user, including their posts and playlists. Allows other users to view the profile, add or remove friends. For the current user, it allows editing the profile, viewing the friends list, and managing posts and playlists.

### Edit ✏️

Allows users to edit their profile, including name, email, and profile picture, keeping the information up to date.

### Friend List 👥

Shows the current user's friends list, allowing viewing of their profiles, removing friends, and navigating to individual profiles.

### Create Playlist ➕📋

Allows users to create new playlists, search for songs by title, and add them to their playlist, entering the playlist name and listing the added songs.

### Edit Playlist 📝📋

Allows modifying existing playlists by adding or removing songs.

### NotFound ❓

404 error page displayed when a user tries to access a non-existent route, offering options to redirect to login or dashboard.

## Relevant Services 🛠️

### Authentication and Users 🔒

Handles user authentication and management through services that communicate with the backend to validate credentials, create new accounts, and retrieve information about the current user or other users. Additionally, users can update their personal information such as name, email, and profile picture.

### Music and Artists 🎤🎵

Manages music and artists by allowing the search of albums and artists in the database, as well as the creation of new records. Facilitates the addition of new songs, including details such as title, artists, release date, genre, duration, and links to external platforms.

### Playlists 📋

For managing playlists, our services allow creating new playlists, retrieving specific playlists by ID, getting the current user's playlists, and the playlists of other users. Also provides functionalities for adding and removing songs within a playlist.

### Posts 📝

Posts on our platform are managed through services that allow creating new posts, retrieving global posts, and user-specific posts, with options to like or dislike them. Also offers functionality to delete posts, ensuring users have full control over their content.

### Social Interaction 💬

Promotes social interaction between users through services that manage friendship relationships, adding or removing friends, and verifying friendship status. Additionally, users can interact with posts through likes and dislikes, creating a more engaging and participatory experience.

## Acknowledgments 🫶
___
We would like to thank everyone who supported the project by testing it and providing valuable feedback. Special thanks to our professor, Jorge Rios, whose guidance and encouragement were crucial to the successful development of this project 🗣️ 🙌

## License 📄

This project is licensed under the [GNU General Public License v3.0](http://www.gnu.org/licenses/gpl-3.0.html).
