import rateLimit from "express-rate-limit";

const requestLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50
})

export default requestLimit