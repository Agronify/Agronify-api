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
const __1 = require("..");
const extract_zip_1 = __importDefault(require("extract-zip"));
const fs = __importStar(require("fs"));
const path_1 = require("path");
class MLModel {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            let res;
            if (id) {
                res = yield __1.prisma.mLModel.findUnique({
                    where: {
                        id: parseInt(id)
                    }
                });
                return res;
            }
            res = __1.prisma.mLModel.findMany();
            return res;
        });
    }
    static post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, type, file, active, input_height, input_width, class_amount, crop_id } = request.payload;
            const res = yield __1.prisma.mLModel.create({
                data: {
                    name,
                    type,
                    file,
                    active,
                    inputHeight: input_height,
                    inputWidth: input_width,
                    classAmount: class_amount,
                    crop: {
                        connect: {
                            id: parseInt(crop_id)
                        }
                    }
                }
            });
            if (active) {
                yield __1.prisma.mLModel.updateMany({
                    where: {
                        crop_id: parseInt(crop_id),
                        id: {
                            not: res.id
                        }
                    },
                    data: {
                        active: false
                    }
                });
                MLModel.downloadModel(file, type, crop_id);
            }
            return res;
        });
    }
    static put(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { name, type, file, active, input_height, input_width, class_amount, crop_id } = request.payload;
            const res = yield __1.prisma.mLModel.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name,
                    type,
                    file,
                    inputHeight: input_height,
                    inputWidth: input_width,
                    classAmount: class_amount,
                    active
                }
            });
            if (active) {
                yield __1.prisma.mLModel.updateMany({
                    where: {
                        crop_id: parseInt(crop_id),
                        id: {
                            not: res.id
                        }
                    },
                    data: {
                        active: false
                    }
                });
                MLModel.downloadModel(file, type, crop_id);
            }
            return res;
        });
    }
    static delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const mlmodel = yield __1.prisma.mLModel.findFirst({
                where: {
                    AND: [
                        {
                            id: parseInt(id)
                        },
                        {
                            active: false
                        }
                    ]
                }
            });
            if (!mlmodel) {
                return { error: "Cannot delete active model" };
            }
            const res = yield __1.prisma.mLModel.delete({
                where: {
                    id: mlmodel === null || mlmodel === void 0 ? void 0 : mlmodel.id
                }
            });
            return res;
        });
    }
    static downloadModel(file, type, crop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmp_name = `${Date.now()}-model.zip`;
            __1.bucket.file(file).download({ destination: tmp_name }, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield (0, extract_zip_1.default)("./" + tmp_name, { dir: (0, path_1.resolve)(`./models/${type}/${crop_id}/active/`) });
                    fs.unlinkSync(tmp_name);
                });
            });
        });
    }
}
exports.default = MLModel;
