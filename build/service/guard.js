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
exports.GuardService = void 0;
class GuardService {
    constructor(h, role) {
        this.h = h;
        this.role = role;
        this.h = this.h.bind(this);
        this.handler = this.handler.bind(this);
        this.User = this.User.bind(this);
        this.Admin = this.Admin.bind(this);
    }
    handler(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.role) {
                case "User":
                    return this.User(request, response);
                case "Admin":
                    return this.Admin(request, response);
                default:
                    return response.response({ error: "Not implemented" }).code(501);
            }
        });
    }
    User(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.auth.isAuthenticated) {
                return response.response({ error: "Unauthorized" }).code(401);
            }
            return this.h(request, response);
        });
    }
    Admin(request, response) {
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
exports.GuardService = GuardService;
