import axios from "axios"
export default class WeatherService{

    private lat : number;
    private lon : number;
    private tz : string;

    constructor(lat:number, lon:number, tz:string){
        this.lat = lat;
        this.lon = lon;
        this.tz = tz;
    }

    public async getCurrentWeather(){
        let res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&current_weather=true&timezone=${this.tz}`)
        return res.data
    }

    public async getForecastWeather(){
        let res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max&timezone=${this.tz}`)
        return res.data
    }
}