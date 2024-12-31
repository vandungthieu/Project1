const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({
  
  UID: { type: String, required: true },
  id_port: {type: String, required : true},
  date_in: { type: String, required: true },
  time_in: { type: String, required: true },
  status: { type: String, required: true }, // Lưu trạng thái của User (in, out)

});

module.exports = mongoose.model('History', historySchema);
