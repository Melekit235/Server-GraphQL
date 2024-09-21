require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

const users = [];
const files = [];

const typeDefs = gql`
  type Query {
    files: [String!]
  }

  type Mutation {
    register(username: String!, password: String!): AuthResponse!
    login(username: String!, password: String!): AuthResponse!
    deleteFile(filename: String!): DeleteResponse!
  }

  type AuthResponse {
    success: Boolean!
    token: String
  }

  type DeleteResponse {
    success: Boolean!
  }
`;

const resolvers = {
  Query: {
    files: (parent, args, context) => {
      if (!context.user) throw new Error('Authentication required');
      return files;
    }
  },
  Mutation: {
    register: (parent, { username, password }) => {
      if (users.find(u => u.username === username)) {
        return { success: false };
      }
      users.push({ username, password });
      return { success: true };
    },
    login: (parent, { username, password }) => {
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        return { success: false };
      }
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { success: true, token };
    },
    deleteFile: (parent, { filename }, context) => {
      if (!context.user) throw new Error('Authentication required');
      const fileIndex = files.indexOf(filename);
      if (fileIndex === -1) return { success: false };

      files.splice(fileIndex, 1);
      fs.unlinkSync(path.join(__dirname, 'uploads', filename));
      return { success: true };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    try {
      const user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
      return { user };
    } catch (err) {
      return {};
    }
  }
});

server.start().then(() => {
  server.applyMiddleware({ app });

  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    files.push(req.file.originalname);
    res.status(200).send('File uploaded');
  });

  app.use(express.static('client'));

  app.listen({ port: 3000 }, () => {
    console.log(`Server ready at http://localhost:3000/`);
  });
});
