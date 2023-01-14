const Ratelimit = require("express-rate-limit");

const limit = Ratelimit({
    windowMs: 3 * 60 * 1000,
    max: 5,

})



module.exports = limit;