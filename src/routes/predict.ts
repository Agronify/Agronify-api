import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import PredictService from "../service/predict";

export default class Predict{
    public static async post(request: Request, response: ResponseToolkit) {
        const { type, name, path } = request.payload as any;
        const predict = new PredictService(type, name, path);
        const result = await predict.predict();
        if (result){
            return response.response(result);
        }
        return response.response({error: "invalid type"});
    }
}