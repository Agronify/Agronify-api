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

import * as dotenv from 'dotenv'
import Knowledge from "./handler/knowledge";
import Auth from "./handler/auth";
import User from "./handler/user";
import { GuardAdmin, GuardUser } from "./service/guard";

export const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
})

export const storage = new Storage({keyFilename: "./google-cloud-key.json"});
export const bucket = storage.bucket("agronify_bucket");

dotenv.config()
init().then(async (server) => {
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET,
        validate: async (decoded:any, request:Request, h:any) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id
                }
            });
            if (user) {
                return { isValid: true };
            } else {
                return { isValid: false };
            }
        }
    });
    server.auth.default('jwt');


    server.route({
        method: 'GET',
        path: '/v1/weather',
        handler: Weather.get,
        options: {
            auth: false
        }
    });

    server.route({
        method: 'POST',
        path: '/v1/upload',
        options: {
            payload: {
                parse: true,
                allow: "multipart/form-data",
                maxBytes: 1024 * 1024 * 20,
				multipart: { output: "file" }
            }
        },
        handler: new GuardUser(Upload.upload).handler
    });

    server.route({
        method: 'POST',
        path: '/v1/predict',
        handler: new GuardUser(Predict.post).handler,
    });

    server.route({
        method: 'GET',
        path: '/v1/knowledges/{id?}',
        handler: Knowledge.get,
        options: {
            auth: false
        }
    });
    server.route({
        method: 'POST',
        path: '/v1/knowledges',
        handler: new GuardAdmin(Knowledge.post).handler,
    });
    server.route({
        method: 'PUT',
        path: '/v1/knowledges/{id}',
        handler: new GuardAdmin(Knowledge.put).handler,
    });
    server.route({
        method: 'DELETE',
        path: '/v1/knowledges/{id}',
        handler: new GuardAdmin(Knowledge.delete).handler,
    });

    server.route({
        method: 'GET',
        path: '/v1/crops/{id?}',
        handler: Crop.get,
        options: {
            auth: false
        }
    });
    server.route({
        method: 'POST',
        path: '/v1/crops',
        handler: new GuardAdmin(Crop.post).handler,
    });
    server.route({
        method: 'PUT',
        path: '/v1/crops/{id}',
        handler: new GuardAdmin(Crop.put).handler,
    });
    server.route({
        method: 'DELETE',
        path: '/v1/crops/{id}',
        handler: new GuardAdmin(Crop.delete).handler,
    });

    server.route({
        method: 'GET',
        path: '/v1/crops/{crop_id}/diseases/{id?}',
        handler: CropDisease.get,
        options: {
            auth: false
        }
    });
    server.route({
        method: 'POST',
        path: '/v1/crops/{crop_id}/diseases',
        handler: new GuardAdmin(CropDisease.post).handler,
    });
    server.route({
        method: 'PUT',
        path: '/v1/crops/{crop_id}/diseases/{id}',
        handler: new GuardAdmin(CropDisease.put).handler,
    });
    server.route({
        method: 'DELETE',
        path: '/v1/crops/{crop_id}/diseases/{id}',
        handler: new GuardAdmin(CropDisease.delete).handler,
    });

    server.route({
        method: 'GET',
        path: '/v1/models/{id?}',
        handler: new GuardAdmin(MLModel.get).handler,
    });
    server.route({
        method: 'POST',
        path: '/v1/models',
        handler: new GuardAdmin(MLModel.post).handler,
    });
    server.route({
        method: 'PUT',
        path: '/v1/models/{id}',
        handler: new GuardAdmin(MLModel.put).handler,
    });
    server.route({
        method: 'DELETE',
        path: '/v1/models/{id}',
        handler: new GuardAdmin(MLModel.delete).handler,
    });

    server.route({
        method: 'GET',
        path: '/v1/models/{mlmodel_id}/classes/{id?}',
        handler: new GuardAdmin(ModelClass.get).handler,
    });
    server.route({
        method: 'POST',
        path: '/v1/models/{mlmodel_id}/classes',
        handler: new GuardAdmin(ModelClass.post).handler,
    });
    server.route({
        method: 'PUT',
        path: '/v1/models/{mlmodel_id}/classes/{id}',
        handler: new GuardAdmin(ModelClass.put).handler,
    });
    server.route({
        method: 'DELETE',
        path: '/v1/models/{mlmodel_id}/classes/{id}',
        handler: new GuardAdmin(ModelClass.delete).handler,
    });

    server.route({
        method: 'POST',
        path: '/v1/auth/signin',
        handler: Auth.signin,
        options: {
            auth: false
        }
    });
    server.route({
        method: 'POST',
        path: '/v1/auth/signup',
        handler: Auth.signup,
        options: {
            auth: false
        }
    });

    server.route({
        method: 'GET',
        path: '/v1/users/{id?}',
        handler: new GuardAdmin(User.get).handler,
    });
    server.route({
        method: 'POST',
        path: '/v1/users',
        handler: new GuardAdmin(User.post).handler,
    });
    server.route({
        method: 'PUT',
        path: '/v1/users/{id}',
        handler: new GuardAdmin(User.put).handler,
    });
    server.route({
        method: 'DELETE',
        path: '/v1/users/{id}',
        handler: new GuardAdmin(User.delete).handler,
    });

    start();
});