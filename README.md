# Authentication and File Management System with GraphQL

## Overview

This project is a web-based authentication and file management system, utilizing a combination of **GraphQL** and **Apollo Server** for efficient data querying, along with **JWT (JSON Web Tokens)** for secure authentication. Users can register, log in, upload files, and manage their uploaded content with ease. Files are uploaded to a server using **Multer**, while the authentication mechanism ensures that only authorized users can perform file operations like deletion and downloading.

### Key Features

- **User Authentication**: 
  - Secure registration and login using JWT.
  - Token-based session management for security and scalability.

- **File Management**: 
  - File uploads are handled using **Multer** with file storage on the server.
  - Users can download and delete files via the UI.
  - A list of uploaded files is displayed, with each file linked for easy downloading or deletion.

- **GraphQL API**: 
  - GraphQL queries and mutations manage user authentication and file operations.
  - The API includes secure resolvers that ensure only authenticated users can interact with file-related operations.

- **Environment Configuration**:
  - Sensitive information, such as JWT secrets, is managed using environment variables, configured via **dotenv**.

## Technologies Used

- **Frontend**: 
  - HTML
  - CSS
  - Vanilla JavaScript

- **Backend**:
  - **Node.js** and **Express.js**: Backend framework and server setup.
  - **Apollo Server**: A GraphQL server to handle queries and mutations.
  - **Multer**: Middleware for handling file uploads.
  - **JWT**: For user authentication and authorization.
  - **dotenv**: For managing environment variables.


