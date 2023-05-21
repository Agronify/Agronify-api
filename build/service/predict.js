"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs-node"));
const fs = __importStar(require("fs"));
const __1 = require("..");
const model_1 = require("../utils/model");
class PredictService {
    constructor(type, name, crop_id, path) {
        this.type = type;
        this.name = name;
        this.path = path;
        this.crop_id = crop_id;
        this.model = new Promise((resolve, reject) => {
            resolve(tf.sequential());
        });
        this.mlModel = __1.prisma.mLModel.findFirst({
            where: {
                AND: [
                    {
                        crop_id: this.crop_id
                    },
                    {
                        active: true
                    }
                ]
            }
        });
    }
    init() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let dir = `./models/${this.type}/${this.crop_id}/active/model.json`;
            if (!fs.existsSync(dir)) {
                yield model_1.ModelUtils.downloadModel((_a = (yield this.mlModel)) === null || _a === void 0 ? void 0 : _a.file, this.type, this.crop_id);
            }
            const fileModel = tf.io.fileSystem(dir);
            this.model = tf.loadLayersModel(fileModel);
        });
    }
    predict() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case "disease":
                    return yield this.disease();
                case "ripeness":
                    return yield this.ripeness();
                default:
                    return null;
            }
        });
    }
    disease() {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield __1.bucket.file(this.path).download();
            const mlModel = yield this.mlModel;
            try {
                const tensor = tf.node.decodeImage(stream[0], 3).reshape([1, 150, 150, 3]);
                const prediction = (yield this.model).predict(tensor);
                const result = prediction.argMax(1).dataSync()[0];
                const confidence = prediction.max(1).dataSync()[0] * 100;
                const modelClass = yield __1.prisma.modelClass.findFirst({
                    where: {
                        AND: [
                            {
                                index: result
                            },
                            {
                                mlmodel_id: mlModel === null || mlModel === void 0 ? void 0 : mlModel.id
                            }
                        ]
                    },
                    include: {
                        disease: true,
                    }
                });
                return {
                    path: this.path,
                    result: (modelClass === null || modelClass === void 0 ? void 0 : modelClass.disease.name) === "Healthy" ? "Healthy" : "unhealthy",
                    disease: (modelClass === null || modelClass === void 0 ? void 0 : modelClass.disease.name) === "Healthy" ? undefined : modelClass === null || modelClass === void 0 ? void 0 : modelClass.disease,
                    confidence: confidence
                };
            }
            catch (error) {
                console.log(error);
            }
            return true;
        });
    }
    ripeness() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const time = Math.floor(Math.random() * 2000) + 1000;
                const result = Math.floor(Math.random() * 100) + 1;
                const confidence = Math.floor(Math.random() * 100) + 1;
                setTimeout(() => {
                    resolve({
                        path: this.path,
                        result: result < 20 ? "unripe" : result > 80 ? "too ripe" : "ripe",
                        confidence: confidence
                    });
                }, time);
            });
        });
    }
}
exports.default = PredictService;
