import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import express from "express";
import { fileURLToPath } from "url";
import { useServer } from "graphql-ws/lib/use/ws";
import fs from "fs";
import path from "path";
import connectToDataBase from "./dataBase/connection.js";
import resolvers from "./graphql/resolvers.js";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

const dirName = path.dirname(fileURLToPath(import.meta.url));
const typeDefs = fs.readFileSync(
  path.join(dirName, "graphql", "schema.graphql"),
  "utf8"
);

await connectToDataBase();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
app.use(cors());

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
};

startServer();

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
  );
});
