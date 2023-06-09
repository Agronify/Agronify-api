import { ReqRefDefaults, Request, ResponseToolkit } from "@hapi/hapi";
import PredictService from "../service/predict";
import { prisma } from "..";

export default class Predict{
    public static async post(request: Request, response: ResponseToolkit) {
        const { type, crop_id, path } = request.payload as any;
        const crop = await prisma.crop.findUnique({
            where: {
                id: parseInt(crop_id)
            }
        });
        if (!crop){
            return response.response({error: "invalid crop_id"});
        }
        const mlModel = await prisma.mLModel.findFirst({
            where: {
                AND: [
                    {
                        crop_id: crop.id
                    },
                    {
                        active: true
                    },
                    {
                        type
                    }
                ]
            }
        });

        if (!mlModel){
            return response.response({error: "invalid type"});
        }

        const predict = new PredictService(type, crop?.name, crop?.id, path);
        await predict.init();
        const result = await predict.predict();
        if (result){
            return response.response(result);
        }
        return response.response({error: "invalid type"});
    }
}