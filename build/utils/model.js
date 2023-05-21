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
exports.ModelUtils = void 0;
const __1 = require("..");
const extract_zip_1 = __importDefault(require("extract-zip"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
class ModelUtils {
    static downloadModel(file, type, crop_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmp_name = `${Date.now()}-model.zip`;
            let dir = (0, path_1.resolve)(`./models/${type}/${crop_id}/active/`);
            let extracted = false;
            __1.bucket.file(file).download({ destination: tmp_name }, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield (0, extract_zip_1.default)("./" + tmp_name, { dir: (0, path_1.resolve)(`./models/${type}/${crop_id}/active/`) });
                    fs_1.default.unlinkSync(tmp_name);
                });
            });
            while (!extracted) {
                yield new Promise(resolve => setTimeout(resolve, 1000));
                if (fs_1.default.existsSync(dir)) {
                    extracted = true;
                }
            }
        });
    }
}
exports.ModelUtils = ModelUtils;
