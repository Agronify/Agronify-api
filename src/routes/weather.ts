import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import WeatherService from "../service/weather";

export default class Weather{
    public static async getWeather(request: Request, response: ResponseToolkit) {
        let {lat, lon, tz, type} = request.query;
        let weatherService = new WeatherService(lat,lon,tz);
        let weather = null;
        switch (type) {
            case "current":
                weather = await weatherService.getCurrentWeather();
                break;
            case "forecast":
                weather = await weatherService.getForecastWeather();
            default:
                break;
        }
        return response.response(weather);
    }
}