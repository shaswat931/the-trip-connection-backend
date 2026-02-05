const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// ================= ENV =================
dotenv.config();

// ================= DB CONNECT =================
connectDB();

const app = express();

// ================= CORS (NETLIFY FIX) =================
// FIX: Using function based origin check to handle localhost and Netlify
const allowedOrigins = [
  "https://thetripconnection.netlify.app", // Your Netlify Frontend
  "http://localhost:3000",                 // Local dev port 1
  "http://localhost:5000",                 // Local dev port 2
  // Add Render's backend URL if you are testing the API endpoint directly from a browser tab
  "https://the-trip-connection-backend.orender.com" 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps/postman) or if in allowed list
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Added PATCH method for potential status updates later
  credentials: true
}));

// ================= MIDDLEWARE =================
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ================= MODELS =================
const Booking = require('./models/Booking'); // Tour Bookings
const Contact = require('./models/Contact');
const Package = require('./models/Package');
const Offer = require('./models/Offer'); // Assuming relative path is correct now
const CarBooking = require('./models/CarBooking');
const BusBooking = require('./models/BusBooking');

// ================= TEST =================
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is running successfully!' });
});


// =================================================
// ================= BOOKINGS (Tour Packages) ======
// =================================================
app.post('/api/bookings', async (req, res) => {
  try {
    // Ensures status is 'New' by default, or uses status provided in request body
    const bookingData = { ...req.body, status: req.body.status || 'New' };
    const booking = await Booking.create(bookingData);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

app.delete('/api/admin/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});


// =================================================
// ================= CONTACT ========================
// =================================================
app.post('/api/contact', async (req, res) => {
  try {
    await Contact.create(req.body);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch {
    res.status(500).json({ error: 'Failed to load contacts' });
  }
});


// =================================================
// ================= PACKAGES =======================
// =================================================
app.post('/api/admin/packages', async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.json({ success: true, pkg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch {
    res.status(500).json({ error: 'Failed to load packages' });
  }
});

app.delete('/api/admin/packages/:id', async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});


// =================================================
// ================= CAR BOOKING ===================
// =================================================
app.post('/api/car-booking', async (req, res) => {
  try {
    const carBookingData = { ...req.body, status: req.body.status || 'New' };
    const carBooking = await CarBooking.create(carBookingData);
    res.json({ success: true, carBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/car-bookings', async (req, res) => {
  try {
    const bookings = await CarBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to load car bookings' });
  }
});

app.delete('/api/admin/car-bookings/:id', async (req, res) => {
  try {
    await CarBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});


// =================================================
// ================= BUS BOOKING ===================
// =================================================
app.post('/api/bus-booking', async (req, res) => {
  try {
    const busBookingData = { ...req.body, status: req.body.status || 'New' };
    const busBooking = await BusBooking.create(busBookingData);
    res.status(201).json({ success: true, busBooking });
  } catch (err) {
    console.error("Bus Booking Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/bus-bookings', async (req, res) => {
  try {
    const bookings = await BusBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to load bus bookings' });
  }
});

app.delete('/api/admin/bus-bookings/:id', async (req, res) => {
  try {
    await BusBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});


// =================================================
// ================= OFFER ==========================
// =================================================
app.post('/api/admin/offer', async (req, res) => {
  try {
    await Offer.deleteMany({});
    const offer = await Offer.create({
      title: req.body.title,
      image: req.body.image,
      delay: Number(req.body.delay) || 10,
      isActive: true
    });
    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/offer', async (req, res) => {
  try {
    const offer = await Offer.findOne({ isActive: true });
    res.json(offer);
  } catch {
    res.status(500).json({ error: 'Failed to load offer' });
  }
});


// =================================================
// ================= DASHBOARD COUNTS (FIXED FOR LEGACY DATA) ====
// =================================================
app.get('/api/admin/dashboard-counts', async (req, res) => {
  try {
    const newCountQuery = { 
        $or: [
            { status: 'New' },
            { status: { $exists: false } }
        ]
    };
      
    // 1. TOUR BOOKINGS (Actionable)
    const tourBookings = await Booking.countDocuments(newCountQuery);

    // 2. CAR BOOKINGS (Actionable)
    const carBookings = await CarBooking.countDocuments(newCountQuery); 
    
    // 3. BUS BOOKINGS (Actionable)
    const busBookings = await BusBooking.countDocuments(newCountQuery);   
    
    // 4. Total static counts (These count ALL records, regardless of status)
    const contacts = await Contact.countDocuments();
    const packages = await Package.countDocuments();

    // Sum of all actionable items
    const totalNewActionable = tourBookings + carBookings + busBookings; 

    res.json({ 
      tourBookings, 
      contacts, 
      packages, 
      carBookings,
      busBookings,
      totalNewActionable
    });
    
  } catch (error) {
    console.error("Dashboard count error:", error);
    res.status(500).json({ error: 'Failed to load dashboard counts' });
  }
});


// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});