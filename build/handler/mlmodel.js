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
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const model_1 = require("../utils/model");
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
                yield model_1.ModelUtils.downloadModel(file, type, crop_id);
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
                yield model_1.ModelUtils.downloadModel(file, type, crop_id);
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
}
exports.default = MLModel;