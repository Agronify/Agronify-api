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
const predict_1 = __importDefault(require("../service/predict"));
const __1 = require("..");
class Predict {
    static post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, crop_id, path } = request.payload;
            const crop = yield __1.prisma.crop.findUnique({
                where: {
                    id: parseInt(crop_id)
                }
            });
            if (!crop) {
                return response.response({ error: "invalid crop_id" });
            }
            const predict = new predict_1.default(type, crop === null || crop === void 0 ? void 0 : crop.name, crop === null || crop === void 0 ? void 0 : crop.id, path);
            const result = yield predict.predict();
            if (result) {
                return response.response(result);
            }
            return response.response({ error: "invalid type" });
        });
    }
}
exports.default = Predict;
