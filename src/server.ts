import Hapi from "@hapi/hapi";
import { Server } from "@hapi/hapi";
export let server: Server;
export const init = async (): Promise<Server> => {
  server = Hapi.server({
    port: process.env.PORT || 4000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: [
          "http://localhost:8080",
          "http://dev.agronify.com",
          "https://dev.agronify.com",
          "https://bangkit-agronify.et.r.appspot.com",
          "https://agronify.com",
        ],
        credentials: true,
      },
    },
  });
  return server;
};

export const start = async function (): Promise<void> {
  console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
  return server.start();
};

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection");
  console.error(err);
});
