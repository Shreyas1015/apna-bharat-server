// const corsOptions = cors({
//   origin: "http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// });

// module.exports = corsOptions;
const cors = require("cors");
const allowedOrigins = ["https://apna-bharat-client.vercel.app"];

const corsOptions = cors({
  origin: (origin, callback) => {
    console.log("Request received from origin:", origin);
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS policy:", origin);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
});
module.exports = corsOptions;
