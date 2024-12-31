const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  finger: { type: String, required: true }, 
  status: { type: String, enum: ['In', 'Out'], default: 'Out' },  // Trạng thái người dùng
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
    