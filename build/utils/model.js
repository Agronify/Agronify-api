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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelUtils = void 0;
const __1 = require("..");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const tf = __importStar(require("@tensorflow/tfjs-node"));
class ModelUtils {
    static downloadModel(file, type, crop_id, model_id, active) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tmp_name = `${Date.now()}-model.h5`;
                let dir = (0, path_1.resolve)(`./models/${type}/${crop_id}/${model_id}`);
                try {
                    fs_1.default.unlinkSync(dir);
                }
                catch (error) { }
                let extracted = false;
                try {
                    __1.bucket
                        .file(file)
                        .download({ destination: tmp_name }, function (err) {
                        return __awaiter(this, void 0, void 0, function* () {
                            (0, child_process_1.exec)("tensorflowjs_converter --input_format=keras " +
                                tmp_name +
                                " " +
                                dir);
                        });
                    });
                }
                catch (error) {
                    console.log("Download error ", error);
                }
                while (!extracted) {
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                    if (fs_1.default.existsSync(dir)) {
                        extracted = true;
                        fs_1.default.unlinkSync(tmp_name);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    static updateModelInfo(file, type, crop_id, model_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let dir = `./models/${type}/${crop_id}/${model_id}/model.json`;
            const model = yield tf.loadLayersModel(tf.io.fileSystem(dir));
            const inputHeight = model.getLayer(undefined, 0).batchInputShape[1];
            const inputWidth = model.getLayer(undefined, 0).batchInputShape[2];
            const layerAmount = model.layers.length;
            const classAmount = model.getLayer(undefined, layerAmount - 1).getConfig()
                .units;
            const modelInfo = {
                inputHeight,
                inputWidth,
                classAmount,
            };
            yield __1.prisma.mLModel.update({
                where: {
                    id: model_id,
                },
                data: modelInfo,
            });
            yield __1.prisma.modelClass.deleteMany({
                where: {
                    mlmodel_id: model_id,
                },
            });
            for (let i = 0; i < classAmount; i++) {
                yield __1.prisma.modelClass.create({
                    data: {
                        mlmodel_id: model_id,
                        index: i,
                    },
                });
            }
        });
    }
}
exports.ModelUtils = ModelUtils;
