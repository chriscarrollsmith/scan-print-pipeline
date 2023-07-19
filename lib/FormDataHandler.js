"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// Brute force method for handling form data from a POST request
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const busboy = require("busboy");
const { generateRandomName, log } = require("./utils");
const mimes = require("./MIMEHandler");

module.exports = class {
    constructor(request) {
        this.request = request;
        this.fields = {};
        this.thereIsFile = false;
        this.fileNumber = 0;
        this.uploadedFiles = [];
        // handlefields method isn't bound to this like the other methods
        this.handleFields = this.handleFields.bind(this);
    }
    run() {
        return new Promise((resolve, reject) => {
            const bb = busboy({ headers: this.request.headers });
            bb.on("field", this.handleFields);
            bb.on("file", (name, stream, info) => this.saveFiles(name, stream, info, resolve));
            bb.on("close", () => this.onRetrievingAllData(resolve));
            this.request.pipe(bb);
        });
    }
    handleFields(name, value) {
        this.fields[name] = value;
    }
    saveFiles(name, stream, info, resolve) {
        const randomName = generateRandomName();
        const ext = mimes.findExtensionFromMIMEType(info.mimeType);
        const filePath = path_1.default.join(__dirname, '..', "uploaded", `${randomName}${ext}`);
        stream.pipe(fs_1.default.createWriteStream(filePath))
            .on("finish", () => this.onSavingFile(filePath, resolve));
    }
    onSavingFile(filePath, resolve) {
        this.uploadedFiles.push(filePath);
        this.thereIsFile = true;
        this.fileNumber += 1;
        if (this.fileNumber == Number(this.fields.fileNumber)) {
            log("All files have been saved");
            resolve([this.fields, this.uploadedFiles]);
        }
    }
    onRetrievingAllData(resolve) {
        log("All data has been received");
        if (this.thereIsFile) {
            if (!this.fields.fileNumber) {
                throw new Error("fileNumber field was not uploaded");
            }
            else if (this.fileNumber == Number(this.fields.fileNumber)) {
                resolve([this.fields, this.uploadedFiles]);
            }
            else {
                return;
            }
        }
    }
};