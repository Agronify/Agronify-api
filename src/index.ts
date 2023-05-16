import Weather from "./routes/weather";
import { init, start } from "./server";

import * as dotenv from 'dotenv'
dotenv.config()
init().then(async (server) => {
    server.route({
        method: 'GET',
        path: '/v1/weather',
        handler: Weather.getWeather
    });
    start();
});