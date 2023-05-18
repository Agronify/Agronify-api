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
class PredictService {
    constructor(type, name, path) {
        this.type = type;
        this.name = name;
        this.path = path;
    }
    predict() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.type) {
                case "disease":
                    return yield this.disease();
                case "ripeness":
                    return yield this.ripeness();
                default:
                    return null;
            }
        });
    }
    disease() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const time = Math.floor(Math.random() * 2000) + 1000;
                const result = Math.floor(Math.random() * 100) + 1;
                const confidence = Math.floor(Math.random() * 100) + 1;
                setTimeout(() => {
                    resolve({
                        path: this.path,
                        result: result > 50 ? "healthy" : "unhealthy",
                        confidence: confidence,
                        disease: result > 50 ? {} : {
                            name: "Bacterial Blight",
                            description: "lorem ipsum dolor sit amet consectetur adipi scing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            treatment: "lorem ipsum dolor sit amet consectetur adipi scing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                        },
                    });
                }, time);
            });
        });
    }
    ripeness() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const time = Math.floor(Math.random() * 2000) + 1000;
                const result = Math.floor(Math.random() * 100) + 1;
                const confidence = Math.floor(Math.random() * 100) + 1;
                setTimeout(() => {
                    resolve({
                        path: this.path,
                        result: result < 20 ? "unripe" : result > 80 ? "too ripe" : "ripe",
                        confidence: confidence
                    });
                }, time);
            });
        });
    }
}
exports.default = PredictService;
