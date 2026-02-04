import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_SIZE = 10000000; // 10MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(CURRENT_DIR, "../public/uploads/dogs"));
    },
    filename: (req, file, cb) => {
        const fileExtension = extname(file.originalname);
        const fileName = file.originalname.split(fileExtension)[0];
        cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    }
});

const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(CURRENT_DIR, "../public/uploads/users"));
    },
    filename: (req, file, cb) => {
        const fileExtension = extname(file.originalname);
        const fileName = file.originalname.split(fileExtension)[0];
        cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    }
});

const uploadDogImg = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Only ${MIMETYPES.join(" ")} are allowed`));
        }
    },
    limits: {
        fileSize: MAX_SIZE
    }
});

const uploadUserImg = multer({
    storage: userStorage,
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Only ${MIMETYPES.join(" ")} are allowed`));
        }
    },
    limits: {
        fileSize: MAX_SIZE
    }
});

export const uploadDog = uploadDogImg.array("images", 5); // Allow up to 5 images
export const uploadProfilePicture = uploadUserImg.single("profilePicture");
