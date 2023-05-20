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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const __1 = require("..");
class Upload {
    static upload(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { file, folder } = request.payload;
            const filename = `${Date.now()}-${file.filename}`;
            const fullpath = folder + filename;
            const blob = __1.bucket.file(fullpath);
            const fileStream = fs.readFileSync(file.path);
            const blobStream = blob.createWriteStream({
                resumable: false
            });
            let done = false;
            let error = false;
            blobStream.on("finish", () => {
                done = true;
                blob.makePublic();
            });
            blobStream.on("error", (err) => {
                done = true;
                error = true;
                console.log(err);
            });
            blobStream.end(Buffer.from(fileStream));
            while (!done) {
                yield new Promise((resolve) => setTimeout(resolve, 100));
            }
            return response.response(error ? { error: "Error uploading file" } : {
                path: fullpath,
                url: `https://storage.googleapis.com/${__1.bucket.name}/${fullpath}`
            });
        });
    }
}
exports.default = Upload;
