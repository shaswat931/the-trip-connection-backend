const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: Number,
  duration: String,
  places: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
