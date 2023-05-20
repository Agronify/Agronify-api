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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encrypt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Encrypt = (params, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (['create', 'update'].includes(params.action) && params.model == 'User') {
        let user = params.args.data;
        let salt = bcryptjs_1.default.genSaltSync(10);
        let hash = bcryptjs_1.default.hashSync(user.password, salt);
        user.password = hash;
    }
    if (['findMany', 'findFirst'].includes(params.action) && params.model == 'User') {
        let user = yield next(params);
        if (user.length > 0) {
            user.map((item) => {
                item.password = null;
            });
        }
        else {
            user.password = null;
        }
        return user;
    }
    return yield next(params);
});
exports.Encrypt = Encrypt;
