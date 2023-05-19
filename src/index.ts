import { PrismaClient } from "@prisma/client";
import Predict from "./handler/predict";
import Upload from "./handler/upload";
import Weather from "./handler/weather";
import { init, start } from "./server";

import * as dotenv from 'dotenv'
import Knowledge from "./handler/knowledge";

export const prisma = new PrismaClient()


dotenv.config()
init().then(async (server) => {
    server.route({
        method: 'GET',
        path: '/v1/weather',
        handler: Weather.get
    });

    server.route({
        method: 'POST',
        path: '/v1/upload',
        options: {
            payload: {
                parse: true,
                allow: "multipart/form-data",
                maxBytes: 1024 * 1024 * 10,
				multipart: { output: "file" }
            }
        },
        handler: Upload.upload
    });

    server.route({
        method: 'GET',
        path: '/v1/files/{path}',
        handler: Upload.get
    });

    server.route({
        method: 'POST',
        path: '/v1/predict',
        handler: Predict.post
    });

    server.route({
        method: 'GET',
        path: '/v1/knowledge/{id?}',
        handler: Knowledge.get
    });
    server.route({
        method: 'POST',
        path: '/v1/knowledge',
        handler: Knowledge.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/knowledge/{id}',
        handler: Knowledge.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/knowledge/{id}',
        handler: Knowledge.delete
    });

    start();
});