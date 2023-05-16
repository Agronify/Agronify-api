"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const weather_1 = __importDefault(require("../service/weather"));
class Weather {
    static getWeather(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let { lat, lon, tz, type } = request.query;
            let weatherService = new weather_1.default(lat, lon, tz);
            let weather = null;
            switch (type) {
                case "current":
                    weather = yield weatherService.getCurrentWeather();
                    break;
                case "forecast":
                    weather = yield weatherService.getForecastWeather();
                default:
                    break;
            }
            return response.response(weather);
        });
    }
}
exports.default = Weather;
