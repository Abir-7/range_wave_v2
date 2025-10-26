import path from "path";
import fs from "fs";
import multer from "multer";
import { Request } from "express";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let folder = "others";

    if (file.mimetype.startsWith("image/")) folder = "images";
    else if (file.mimetype.startsWith("audio/")) folder = "audio";
    else if (file.mimetype.startsWith("video/")) folder = "video";
    else if (
      file.mimetype.includes("pdf") ||
      file.mimetype.includes("msword") ||
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheet")
    ) {
      folder = "docs";
    }

    const uploadPath = path.join("uploads", folder);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});
