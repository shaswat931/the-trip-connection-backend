const mongoose = require('mongoose');

const carBookingSchema = new mongoose.Schema({
  
  // --- ADDED NEW FIELDS ---
  name: {
    type: String,
    required: true // Name required for contact
  },
  phone: {
    type: String,
    required: true // Phone required for contact
  },
  // -------------------------

  pickup: {
    type: String,
    required: true // Making sure car details are also required
  },
  drop: {
    type: String,
    required: true
  },
  date: {
    type: String, // You might want to change this to Date if you validate it as a Date object on the backend
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'Car Booking Page' // Default source
  },
  status: {
    type: String,
    default: 'New' // Added status field for dashboard tracking
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CarBooking', carBookingSchema);