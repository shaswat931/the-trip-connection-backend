const mongoose = require('mongoose');

const busBookingSchema = new mongoose.Schema({
  
  // ADDED CLIENT DETAILS
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  
  // BUS DETAILS
  pickup: {
    type: String,
    required: true
  },
  drop: {
    type: String,
    required: true
  },
  date: {
    type: String, 
    required: true
  },
  
  source: {
    type: String,
    default: 'Bus Booking Page'
  },
  status: {
    type: String,
    default: 'New' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BusBooking', busBookingSchema);