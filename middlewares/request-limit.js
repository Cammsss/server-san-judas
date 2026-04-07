import rateLimit from "express-rate-limit";

const windowMs = 15 * 60 * 1000;
const max = 100;

export const publicLimiter = rateLimit({
    windowMs,
    max,
    message: "Demasiadas peticiones, intenta más tarde",
    standardHeaders: true,
    legacyHeaders: false,
})

export const authtenticatedLimiter = rateLimit({
    windowMs,
    max,
    message: "Demasiadas peticiones, intenta más tarde",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        if(req.uid){
            return `uid:${req.uid}`;
        }
        if(req.params.id){
            return `id:${req.params.id}`;
        }
        return req.ip;
    }
})