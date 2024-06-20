// const corsOptions = cors({
//   origin: "http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// });

// module.exports = corsOptions;
const cors = require("cors");
const allowedOrigins = ["https://event-link.vercel.app"];

const corsOptions = cors({
  origin: (origin, callback) => {
    console.log("Request received from origin:", origin); // Log the origin of each request
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow the request if the origin is in the allowed list or not present (server-to-server requests)
    } else {
      console.error("Blocked by CORS policy:", origin);
      callback(new Error("Not allowed by CORS"), false); // Block the request if the origin is not allowed
    }
  },
  credentials: true, // Allow credentials like cookies, authorization headers, etc.
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
});
module.exports = corsOptions;
