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
import { Encrypt } from "./prisma_middleware/password";

export const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"]
})
prisma.$use(Encrypt)
export const storage = new Storage({keyFilename: "./google-cloud-key.json"});
export const bucket = storage.bucket("agronify_bucket");

dotenv.config()
init().then(async (server) => {
    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET,
        validate: async (decoded:any, request:any, h:any) => {
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


    server.route({
        method: 'GET',
        path: '/v1/weather',
        handler: Weather.get,
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
        handler: Upload.upload
    });

    server.route({
        method: 'POST',
        path: '/v1/predict',
        handler: Predict.post
    });

    server.route({
        method: 'GET',
        path: '/v1/knowledges/{id?}',
        handler: Knowledge.get
    });
    server.route({
        method: 'POST',
        path: '/v1/knowledges',
        handler: Knowledge.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/knowledges/{id}',
        handler: Knowledge.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/knowledges/{id}',
        handler: Knowledge.delete
    });

    server.route({
        method: 'GET',
        path: '/v1/crops/{id?}',
        handler: Crop.get
    });
    server.route({
        method: 'POST',
        path: '/v1/crops',
        handler: Crop.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/crops/{id}',
        handler: Crop.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/crops/{id}',
        handler: Crop.delete
    });

    server.route({
        method: 'GET',
        path: '/v1/crops/{crop_id}/diseases/{id?}',
        handler: CropDisease.get
    });
    server.route({
        method: 'POST',
        path: '/v1/crops/{crop_id}/diseases',
        handler: CropDisease.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/crops/{crop_id}/diseases/{id}',
        handler: CropDisease.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/crops/{crop_id}/diseases/{id}',
        handler: CropDisease.delete
    });

    server.route({
        method: 'GET',
        path: '/v1/models/{id?}',
        handler: MLModel.get
    });
    server.route({
        method: 'POST',
        path: '/v1/models',
        handler: MLModel.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/models/{id}',
        handler: MLModel.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/models/{id}',
        handler: MLModel.delete
    });

    server.route({
        method: 'GET',
        path: '/v1/models/{mlmodel_id}/classes/{id?}',
        handler: ModelClass.get
    });
    server.route({
        method: 'POST',
        path: '/v1/models/{mlmodel_id}/classes',
        handler: ModelClass.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/models/{mlmodel_id}/classes/{id}',
        handler: ModelClass.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/models/{mlmodel_id}/classes/{id}',
        handler: ModelClass.delete
    });

    server.route({
        method: 'POST',
        path: '/v1/auth/signin',
        handler: Auth.signin
    });
    server.route({
        method: 'POST',
        path: '/v1/auth/signup',
        handler: Auth.signup
    });

    server.route({
        method: 'GET',
        path: '/v1/users/{id?}',
        handler: User.get
    });
    server.route({
        method: 'POST',
        path: '/v1/users',
        handler: User.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/users/{id}',
        handler: User.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/users/{id}',
        handler: User.delete
    });

    start();
});