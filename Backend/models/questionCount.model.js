const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countSchema = new Schema({

    count: { type: Number, required: true },

    userID:{type:String, required:true}
  });

const CountModel = mongoose.model("count",countSchema);

module.exports = {

    CountModel
    
}