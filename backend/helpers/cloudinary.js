const { v2: cloudinary } = require("cloudinary");
const { config } = require("dotenv");
config();

cloudinary.config({
  cloud_name: "dbwuumsdy",
  api_key: "475396677129287",
  api_secret: "NWDRhICGpjqhwe0IXeQXetut_5k",
});
module.exports = cloudinary;
