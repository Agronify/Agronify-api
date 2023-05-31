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
exports.ModelClass = void 0;
const __1 = require("..");
const client_1 = require("@prisma/client");
class ModelClass {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, mlmodel_id } = request.params;
            let res;
            if (id) {
                res = yield __1.prisma.modelClass.findFirst({
                    where: {
                        AND: [
                            {
                                id: parseInt(id),
                            },
                            {
                                mlmodel_id: parseInt(mlmodel_id),
                            },
                        ],
                    },
                    include: {
                        disease: true,
                    },
                });
                return res;
            }
            res = __1.prisma.modelClass.findMany({
                where: {
                    mlmodel_id: parseInt(mlmodel_id),
                },
                include: {
                    disease: true,
                },
            });
            return res;
        });
    }
    static post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { disease_id, index } = request.payload;
            const { mlmodel_id } = request.params;
            const model = yield __1.prisma.mLModel.findUnique({
                where: {
                    id: parseInt(mlmodel_id),
                },
            });
            if (model && parseInt(index) >= (model === null || model === void 0 ? void 0 : model.classAmount)) {
                return {
                    error: "Index out of range",
                };
            }
            const res = yield __1.prisma.modelClass.create({
                data: {
                    index,
                    mlmodel: {
                        connect: {
                            id: parseInt(mlmodel_id),
                        },
                    },
                    disease: disease_id > 0
                        ? {
                            connect: {
                                id: parseInt(disease_id),
                            },
                        }
                        : undefined,
                },
            });
            return res;
        });
    }
    static put(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { disease_id, index } = request.payload;
            const { mlmodel_id, id } = request.params;
            const model = yield __1.prisma.mLModel.findUnique({
                where: {
                    id: parseInt(mlmodel_id),
                },
            });
            if (model && parseInt(index) >= (model === null || model === void 0 ? void 0 : model.classAmount)) {
                return {
                    error: "Index out of range",
                };
            }
            const res = yield __1.prisma.modelClass.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    index,
                    disease: disease_id > 0
                        ? {
                            connect: {
                                id: parseInt(disease_id),
                            },
                        }
                        : undefined,
                },
            });
            if (disease_id <= 0) {
                const sql = client_1.Prisma.sql([
                    `UPDATE "public"."ModelClass" SET disease_id = NULL WHERE id = ${id};`,
                ]);
                yield __1.prisma.$executeRaw(sql);
            }
            return res;
        });
    }
    static delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const res = yield __1.prisma.modelClass.delete({
                where: {
                    id: parseInt(id),
                },
            });
            return res;
        });
    }
}
exports.ModelClass = ModelClass;
