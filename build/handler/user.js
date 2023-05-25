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
class User {
    static get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            let res;
            if (id) {
                res = yield __1.prisma.user.findUnique({
                    where: {
                        id: parseInt(id),
                    },
                });
                return res;
            }
            res = __1.prisma.user.findMany();
            return res;
        });
    }
    static post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, phone, is_admin } = request.payload;
            const res = yield __1.prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                    is_admin,
                },
            });
            return res;
        });
    }
    static put(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const { name, email, password, phone, is_admin } = request.payload;
            const res = yield __1.prisma.user.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    email,
                    password,
                },
            });
            return res;
        });
    }
    static delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const res = yield __1.prisma.user.delete({
                where: {
                    id: parseInt(id),
                },
            });
            return res;
        });
    }
}
exports.default = User;
