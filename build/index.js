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
exports.bucket = exports.storage = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const predict_1 = __importDefault(require("./handler/predict"));
const upload_1 = __importDefault(require("./handler/upload"));
const weather_1 = __importDefault(require("./handler/weather"));
const crop_1 = __importDefault(require("./handler/crop"));
const cropdisease_1 = __importDefault(require("./handler/cropdisease"));
const mlmodel_1 = __importDefault(require("./handler/mlmodel"));
const modelclass_1 = require("./handler/modelclass");
const server_1 = require("./server");
const storage_1 = require("@google-cloud/storage");
const dotenv = __importStar(require("dotenv"));
const knowledge_1 = __importDefault(require("./handler/knowledge"));
const auth_1 = __importDefault(require("./handler/auth"));
const user_1 = __importDefault(require("./handler/user"));
const guard_1 = require("./service/guard");
exports.prisma = new client_1.PrismaClient({
    log: ["query", "info", "warn", "error"],
});
exports.storage = new storage_1.Storage({ keyFilename: "./google-cloud-key.json" });
exports.bucket = exports.storage.bucket("agronify_bucket");
dotenv.config();
(0, server_1.init)().then((server) => __awaiter(void 0, void 0, void 0, function* () {
    yield server.register(require("hapi-auth-jwt2"));
    server.auth.strategy("jwt", "jwt", {
        key: process.env.JWT_SECRET,
        validate: (decoded, request, h) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield exports.prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
            });
            if (user) {
                return { isValid: true };
            }
            else {
                return { isValid: false };
            }
        }),
    });
    server.auth.default("jwt");
    server.state("token", {
        ttl: 1 * 60 * 60 * 1000,
        isSecure: false,
        isHttpOnly: true,
        encoding: "none",
        clearInvalid: false,
        strictHeader: true,
        path: "/",
    });
    server.route({
        method: "GET",
        path: "/v1/weather",
        handler: weather_1.default.get,
        options: {
            auth: false,
        },
    });
    server.route({
        method: "POST",
        path: "/v1/upload",
        options: {
            payload: {
                parse: true,
                allow: "multipart/form-data",
                maxBytes: 1024 * 1024 * 20,
                multipart: { output: "file" },
            },
        },
        handler: new guard_1.GuardService(upload_1.default.upload, "User").handler,
    });
    server.route({
        method: "POST",
        path: "/v1/predict",
        handler: new guard_1.GuardService(predict_1.default.post, "User").handler,
    });
    server.route({
        method: "GET",
        path: "/v1/knowledges/{id?}",
        handler: knowledge_1.default.get,
        options: {
            auth: false,
        },
    });
    server.route({
        method: "POST",
        path: "/v1/knowledges",
        handler: new guard_1.GuardService(knowledge_1.default.post, "Admin").handler,
    });
    server.route({
        method: "PUT",
        path: "/v1/knowledges/{id}",
        handler: new guard_1.GuardService(knowledge_1.default.put, "Admin").handler,
    });
    server.route({
        method: "DELETE",
        path: "/v1/knowledges/{id}",
        handler: new guard_1.GuardService(knowledge_1.default.delete, "Admin").handler,
    });
    server.route({
        method: "GET",
        path: "/v1/crops/{id?}",
        handler: crop_1.default.get,
        options: {
            auth: false,
        },
    });
    server.route({
        method: "POST",
        path: "/v1/crops",
        handler: new guard_1.GuardService(crop_1.default.post, "Admin").handler,
    });
    server.route({
        method: "PUT",
        path: "/v1/crops/{id}",
        handler: new guard_1.GuardService(crop_1.default.put, "Admin").handler,
    });
    server.route({
        method: "DELETE",
        path: "/v1/crops/{id}",
        handler: new guard_1.GuardService(crop_1.default.delete, "Admin").handler,
    });
    server.route({
        method: "GET",
        path: "/v1/crops/{crop_id}/diseases/{id?}",
        handler: cropdisease_1.default.get,
        options: {
            auth: false,
        },
    });
    server.route({
        method: "POST",
        path: "/v1/crops/{crop_id}/diseases",
        handler: new guard_1.GuardService(cropdisease_1.default.post, "Admin").handler,
    });
    server.route({
        method: "PUT",
        path: "/v1/crops/{crop_id}/diseases/{id}",
        handler: new guard_1.GuardService(cropdisease_1.default.put, "Admin").handler,
    });
    server.route({
        method: "DELETE",
        path: "/v1/crops/{crop_id}/diseases/{id}",
        handler: new guard_1.GuardService(cropdisease_1.default.delete, "Admin").handler,
    });
    server.route({
        method: "GET",
        path: "/v1/models/{id?}",
        handler: new guard_1.GuardService(mlmodel_1.default.get, "Admin").handler,
    });
    server.route({
        method: "POST",
        path: "/v1/models",
        handler: new guard_1.GuardService(mlmodel_1.default.post, "Admin").handler,
    });
    server.route({
        method: "PUT",
        path: "/v1/models/{id}",
        handler: new guard_1.GuardService(mlmodel_1.default.put, "Admin").handler,
    });
    server.route({
        method: "DELETE",
        path: "/v1/models/{id}",
        handler: new guard_1.GuardService(mlmodel_1.default.delete, "Admin").handler,
    });
    server.route({
        method: "GET",
        path: "/v1/models/{mlmodel_id}/classes/{id?}",
        handler: new guard_1.GuardService(modelclass_1.ModelClass.get, "Admin").handler,
    });
    server.route({
        method: "POST",
        path: "/v1/models/{mlmodel_id}/classes",
        handler: new guard_1.GuardService(modelclass_1.ModelClass.post, "Admin").handler,
    });
    server.route({
        method: "PUT",
        path: "/v1/models/{mlmodel_id}/classes/{id}",
        handler: new guard_1.GuardService(modelclass_1.ModelClass.put, "Admin").handler,
    });
    server.route({
        method: "DELETE",
        path: "/v1/models/{mlmodel_id}/classes/{id}",
        handler: new guard_1.GuardService(modelclass_1.ModelClass.delete, "Admin").handler,
    });
    server.route({
        method: "POST",
        path: "/v1/auth/signin",
        handler: auth_1.default.signin,
        options: {
            auth: false,
        },
    });
    server.route({
        method: "POST",
        path: "/v1/auth/signup",
        handler: auth_1.default.signup,
        options: {
            auth: false,
        },
    });
    server.route({
        method: "GET",
        path: "/v1/auth/check",
        handler: auth_1.default.check,
    });
    server.route({
        method: "GET",
        path: "/v1/users/{id?}",
        handler: new guard_1.GuardService(user_1.default.get, "Admin").handler,
    });
    server.route({
        method: "POST",
        path: "/v1/users",
        handler: new guard_1.GuardService(user_1.default.post, "Admin").handler,
    });
    server.route({
        method: "PUT",
        path: "/v1/users/{id}",
        handler: new guard_1.GuardService(user_1.default.put, "Admin").handler,
    });
    server.route({
        method: "DELETE",
        path: "/v1/users/{id}",
        handler: new guard_1.GuardService(user_1.default.delete, "Admin").handler,
    });
    server.route({
        method: "OPTIONS",
        path: "/{any*}",
        handler: function (request, h) {
            const response = h.response();
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            return response;
        },
        options: {
            auth: false,
        },
    });
    (0, server_1.start)();
}));
