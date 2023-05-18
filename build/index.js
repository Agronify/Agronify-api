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
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const predict_1 = __importDefault(require("./handler/predict"));
const upload_1 = __importDefault(require("./handler/upload"));
const weather_1 = __importDefault(require("./handler/weather"));
const server_1 = require("./server");
const dotenv = __importStar(require("dotenv"));
const knowledge_1 = __importDefault(require("./handler/knowledge"));
exports.prisma = new client_1.PrismaClient();
dotenv.config();
(0, server_1.init)().then((server) => __awaiter(void 0, void 0, void 0, function* () {
    server.route({
        method: 'GET',
        path: '/v1/weather',
        handler: weather_1.default.get
    });
    server.route({
        method: 'POST',
        path: '/v1/upload',
        options: {
            payload: {
                parse: true,
                allow: "multipart/form-data",
                multipart: { output: "file" },
            }
        },
        handler: upload_1.default.upload
    });
    server.route({
        method: 'GET',
        path: '/v1/files/{path}',
        handler: upload_1.default.get
    });
    server.route({
        method: 'POST',
        path: '/v1/predict',
        handler: predict_1.default.post
    });
    server.route({
        method: 'GET',
        path: '/v1/knowledge/{id?}',
        handler: knowledge_1.default.get
    });
    server.route({
        method: 'POST',
        path: '/v1/knowledge',
        handler: knowledge_1.default.post
    });
    server.route({
        method: 'PUT',
        path: '/v1/knowledge/{id}',
        handler: knowledge_1.default.put
    });
    server.route({
        method: 'DELETE',
        path: '/v1/knowledge/{id}',
        handler: knowledge_1.default.delete
    });
    (0, server_1.start)();
}));
