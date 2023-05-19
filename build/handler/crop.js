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
class Crop {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            let res;
            if (id) {
                res = yield __1.prisma.crop.findUnique({
                    where: {
                        id: parseInt(id)
                    }
                });
                return res;
            }
            const { search } = request.query;
            if (search) {
                res = yield __1.prisma.crop.findMany({
                    where: {
                        OR: [
                            {
                                name: {
                                    search: search
                                }
                            }
                        ]
                    }
                });
                return res;
            }
            res = __1.prisma.crop.findMany();
            return res;
        });
    }
    static post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, image } = request.payload;
            const res = yield __1.prisma.crop.create({
                data: {
                    name,
                    description,
                    image
                }
            });
            return res;
        });
    }
    static put(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { name, description, image } = request.payload;
            const res = yield __1.prisma.crop.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name,
                    description,
                    image
                }
            });
            return res;
        });
    }
    static delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const res = yield __1.prisma.crop.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return res;
        });
    }
}
exports.default = Crop;
