const mongoose = require("mongoose");
const { Schema } = mongoose;
const BulkSchema = new Schema({
user:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'user'
},

  number: {
    type: Number,
    required: true,
  },
  message: {
    type: String, 
    required: true,
  },

  contact: {
    type: String,
    required: true,
  },

  file: {
    type: String, 
    required: true,
  },
});

const Bulk = mongoose.model("bulk", BulkSchema);
module.exports = Bulk;
