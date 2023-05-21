import { PrismaClient } from "@prisma/client";
import Predict from "./handler/predict";
import Upload from "./handler/upload";
import Weather from "./handler/weather";
import Crop from "./handler/crop";
import CropDisease from "./handler/cropdisease";
import MLModel from "./handler/mlmodel";
import { ModelClass } from "./handler/modelclass";
import { init, start } from "./server";
import { Storage } from "@google-cloud/storage";

import * as dotenv from "dotenv";
import Knowledge from "./handler/knowledge";
import Auth from "./handler/auth";
import User from "./handler/user";
import { GuardService } from "./service/guard";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export const storage = new Storage({ keyFilename: "./google-cloud-key.json" });
export const bucket = storage.bucket("agronify_bucket");

dotenv.config();
init().then(async (server) => {
  await server.register(require("hapi-auth-jwt2"));
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    validate: async (decoded: any, request: Request, h: any) => {
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      if (user) {
        return { isValid: true };
      } else {
        return { isValid: false };
      }
    },
  });
  server.auth.default("jwt");

  server.state("token", {
    ttl: 1 * 60 * 60 * 1000,
    isSecure: false,
    isHttpOnly: true,
    encoding: "none",
    clearInvalid: false,
    strictHeader: true,
    path: "/",
  });

  server.route({
    method: "GET",
    path: "/v1/weather",
    handler: Weather.get,
    options: {
      auth: false,
    },
  });

  server.route({
    method: "POST",
    path: "/v1/upload",
    options: {
      payload: {
        parse: true,
        allow: "multipart/form-data",
        maxBytes: 1024 * 1024 * 20,
        multipart: { output: "file" },
      },
    },
    handler: new GuardService(Upload.upload, "User").handler,
  });

  server.route({
    method: "POST",
    path: "/v1/predict",
    handler: new GuardService(Predict.post, "User").handler,
  });

  server.route({
    method: "GET",
    path: "/v1/knowledges/{id?}",
    handler: Knowledge.get,
    options: {
      auth: false,
    },
  });
  server.route({
    method: "POST",
    path: "/v1/knowledges",
    handler: new GuardService(Knowledge.post, "Admin").handler,
  });
  server.route({
    method: "PUT",
    path: "/v1/knowledges/{id}",
    handler: new GuardService(Knowledge.put, "Admin").handler,
  });
  server.route({
    method: "DELETE",
    path: "/v1/knowledges/{id}",
    handler: new GuardService(Knowledge.delete, "Admin").handler,
  });

  server.route({
    method: "GET",
    path: "/v1/crops/{id?}",
    handler: Crop.get,
    options: {
      auth: false,
    },
  });
  server.route({
    method: "POST",
    path: "/v1/crops",
    handler: new GuardService(Crop.post, "Admin").handler,
  });
  server.route({
    method: "PUT",
    path: "/v1/crops/{id}",
    handler: new GuardService(Crop.put, "Admin").handler,
  });
  server.route({
    method: "DELETE",
    path: "/v1/crops/{id}",
    handler: new GuardService(Crop.delete, "Admin").handler,
  });

  server.route({
    method: "GET",
    path: "/v1/crops/{crop_id}/diseases/{id?}",
    handler: CropDisease.get,
    options: {
      auth: false,
    },
  });
  server.route({
    method: "POST",
    path: "/v1/crops/{crop_id}/diseases",
    handler: new GuardService(CropDisease.post, "Admin").handler,
  });
  server.route({
    method: "PUT",
    path: "/v1/crops/{crop_id}/diseases/{id}",
    handler: new GuardService(CropDisease.put, "Admin").handler,
  });
  server.route({
    method: "DELETE",
    path: "/v1/crops/{crop_id}/diseases/{id}",
    handler: new GuardService(CropDisease.delete, "Admin").handler,
  });

  server.route({
    method: "GET",
    path: "/v1/models/{id?}",
    handler: new GuardService(MLModel.get, "Admin").handler,
  });
  server.route({
    method: "POST",
    path: "/v1/models",
    handler: new GuardService(MLModel.post, "Admin").handler,
  });
  server.route({
    method: "PUT",
    path: "/v1/models/{id}",
    handler: new GuardService(MLModel.put, "Admin").handler,
  });
  server.route({
    method: "DELETE",
    path: "/v1/models/{id}",
    handler: new GuardService(MLModel.delete, "Admin").handler,
  });

  server.route({
    method: "GET",
    path: "/v1/models/{mlmodel_id}/classes/{id?}",
    handler: new GuardService(ModelClass.get, "Admin").handler,
  });
  server.route({
    method: "POST",
    path: "/v1/models/{mlmodel_id}/classes",
    handler: new GuardService(ModelClass.post, "Admin").handler,
  });
  server.route({
    method: "PUT",
    path: "/v1/models/{mlmodel_id}/classes/{id}",
    handler: new GuardService(ModelClass.put, "Admin").handler,
  });
  server.route({
    method: "DELETE",
    path: "/v1/models/{mlmodel_id}/classes/{id}",
    handler: new GuardService(ModelClass.delete, "Admin").handler,
  });

  server.route({
    method: "POST",
    path: "/v1/auth/signin",
    handler: Auth.signin,
    options: {
      auth: false,
    },
  });
  server.route({
    method: "POST",
    path: "/v1/auth/signup",
    handler: Auth.signup,
    options: {
      auth: false,
    },
  });
  server.route({
    method: "GET",
    path: "/v1/auth/check",
    handler: Auth.check,
  });

  server.route({
    method: "GET",
    path: "/v1/users/{id?}",
    handler: new GuardService(User.get, "Admin").handler,
  });
  server.route({
    method: "POST",
    path: "/v1/users",
    handler: new GuardService(User.post, "Admin").handler,
  });
  server.route({
    method: "PUT",
    path: "/v1/users/{id}",
    handler: new GuardService(User.put, "Admin").handler,
  });
  server.route({
    method: "DELETE",
    path: "/v1/users/{id}",
    handler: new GuardService(User.delete, "Admin").handler,
  });

  server.route({
    method: "OPTIONS",
    path: "/{any*}",
    handler: function (request, h) {
      const response = h.response();
      response.header(
        "Access-Control-Allow-Origin",
        request.headers.origin || "*"
      );
      response.header(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, DELETE, OPTIONS"
      );
      response.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      response.header("Access-Control-Allow-Credentials", "true");
      return response;
    },
    options: {
      auth: false,
    },
  });

  start();
});
