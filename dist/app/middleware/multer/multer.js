"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let folder = "others";
        if (file.mimetype.startsWith("image/"))
            folder = "images";
        else if (file.mimetype.startsWith("audio/"))
            folder = "audio";
        else if (file.mimetype.startsWith("video/"))
            folder = "video";
        else if (file.mimetype.includes("pdf") ||
            file.mimetype.includes("msword") ||
            file.mimetype.includes("excel") ||
            file.mimetype.includes("spreadsheet")) {
            folder = "docs";
        }
        const uploadPath = path_1.default.join("uploads", folder);
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
});
