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
exports.GuardAdmin = exports.GuardUser = void 0;
class GuardUser {
    constructor(h) {
        this.h = h;
    }
    handler(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.auth.isAuthenticated) {
                return response.response({ error: "Unauthorized" }).code(401);
            }
            return this.h(request, response);
        });
    }
    static guardAdmin(request, response, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.auth.isAuthenticated) {
                return response.response({ error: "Unauthorized" }).code(401);
            }
            if (!request.auth.credentials.is_admin) {
                return response.response({ error: "Forbidden" }).code(403);
            }
            return handler(request, response);
        });
    }
}
exports.GuardUser = GuardUser;
class GuardAdmin {
    constructor(h) {
        this.h = h;
    }
    handler(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.auth.isAuthenticated) {
                return response.response({ error: "Unauthorized" }).code(401);
            }
            if (!request.auth.credentials.is_admin) {
                return response.response({ error: "Forbidden" }).code(403);
            }
            return this.h(request, response);
        });
    }
}
exports.GuardAdmin = GuardAdmin;
