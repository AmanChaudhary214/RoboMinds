const mongoose = require("mongoose");

require("dotenv").config();

const connection = mongoose.connect(process.env.MONGO);

module.exports = {
    connection
}
