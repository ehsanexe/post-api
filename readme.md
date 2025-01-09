# post-api

![image](https://github.com/user-attachments/assets/cd70d687-f7ba-422c-a74a-081e473bd479)

**post-api** is a full-stack application built as a learning project to explore and understand different API architectures, specifically **REST APIs** and **GraphQL**. The project includes a **React** front-end that consumes both REST APIs and GraphQL from two separate **Node.js** back-end services, one serving GraphQL queries and the other providing REST endpoints.

This project was created to provide hands-on experience in working with and integrating these two API styles in a single application.

## Features

- **CRUD Operations:** Perform create, read, update, and delete operations on resources.
- **File Saving:** Handle file uploads and saving on the back-end.
- **Real-Time Communication:** Built-in **Socket.IO** support for real-time updates between the front-end and back-end.

## Architecture

- **React Frontend:**
  - A user interface that fetches data from either a GraphQL API or a REST API, depending on the `isGraphql` flag.
  
- **Backend Workspaces:**
  1. **GraphQL Workspace:** GraphQL queries and mutations.
  2. **REST API Workspace:** Utilizes Express.js to provide REST endpoints for standard API interactions.

### Installation

1. Install dependencies:
   ```bash
   npm install
2. Scripts:

   Runs frontend and REST API concurrently.
   ```bash
   npm start
   ```
   
   Starts the GraphQL API
   ```bash
    npm run graphql
   ```

   Starts the REST API
   ```bash
    npm run restapi
   ```

   Starts the React frontend
   ```bash
    npm run frontend
   ```


