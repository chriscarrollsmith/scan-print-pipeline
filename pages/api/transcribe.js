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
const openai_1 = require("openai");
const FormDataHandler = require("../lib/FormDataHandler");
const dotenv_1 = __importDefault(require("dotenv"));
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
dotenv_1.default.config();
const configuration = new openai_1.Configuration({
    apiKey: process.env.WHISPER_API_KEY
});

module.exports = function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [fields, files] = yield new FormDataHandler(request).run();
            const openai = new openai_1.OpenAIApi(configuration);
            const openaiResponse = yield openai.createTranscription(node_fs_1.default.createReadStream(files[0]), "whisper-1", undefined, undefined, undefined, "en");
            yield promises_1.default.unlink(files[0]);
            response.writeHead(200, {
                "content-type": "text/plain",
                "access-control-allow-origin": "*"
            });
            response.end(openaiResponse.data.text);
        }
        catch (error) {
            console.log(error);
            response.writeHead(500, { "content-type": "text/plain" });
            response.end("error");
        }
    });
};