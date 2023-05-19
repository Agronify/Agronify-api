import { PrismaClient } from "@prisma/client";
import Predict from "./handler/predict";
import Upload from "./handler/upload";
import Weather from "./handler/weather";
import Crop from "./handler/crop";
import CropDisease from "./handler/cropdisease";
import { init, start } from "./server";

import * as dotenv from 'dotenv'
import Knowledge from "./handler/knowledge";

export const prisma = new PrismaClient({
    // log: ["query", "info", "warn", "error"]
})


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
    start();
});