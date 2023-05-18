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
class Knowledge {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            let res;
            if (id) {
                res = __1.prisma.knowledge.findUnique({
                    where: {
                        id: parseInt(id)
                    }
                });
                return res;
            }
            const { search } = request.query;
            if (search) {
                res = __1.prisma.knowledge.findMany({
                    where: {
                        OR: [
                            {
                                title: {
                                    search: search
                                }
                            },
                            {
                                tags: {
                                    has: search
                                }
                            }
                        ]
                    }
                });
                return res;
            }
            res = __1.prisma.knowledge.findMany();
            return res;
        });
    }
    static post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, tags } = request.payload;
            const res = __1.prisma.knowledge.create({
                data: {
                    title,
                    content,
                    tags
                }
            });
            return res;
        });
    }
    static put(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { title, content, tags } = request.payload;
            const res = __1.prisma.knowledge.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    title,
                    content,
                    tags
                }
            });
            return res;
        });
    }
    static delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const res = __1.prisma.knowledge.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return res;
        });
    }
}
exports.default = Knowledge;
