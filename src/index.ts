import Predict from "./routes/predict";
import Upload from "./routes/upload";
import Weather from "./routes/weather";
import { init, start } from "./server";

import * as dotenv from 'dotenv'
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
				multipart: { output: "file" },
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
    start();
});