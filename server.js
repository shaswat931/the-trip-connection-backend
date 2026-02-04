const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// ================= ENV =================
dotenv.config();

// ================= DB CONNECT =================
connectDB();

const app = express();

// ================= CORS (NETLIFY + LOCALHOST SAFE) =================
const allowedOrigins = [
  "https://thetripconnection.netlify.app",
  "http://localhost:3000",
  "http://localhost:5500"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow REST tools / server-to-server / Render health check
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Preflight support
app.options('*', cors());

// ================= MIDDLEWARE =================
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ================= MODELS =================
const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const Package = require('./models/Package');
const Offer = require('./models/Offer');
const CarBooking = require('./models/CarBooking');
const BusBooking = require('./models/BusBooking');

// ================= TEST =================
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is running successfully!' });
});

// =================================================
// ================= BOOKINGS =======================
// =================================================
app.post('/api/bookings', async (req, res) => {
  try {
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
// ================= DASHBOARD COUNTS ===============
// =================================================
app.get('/api/admin/dashboard-counts', async (req, res) => {
  try {
    const tourBookings = await Booking.countDocuments({ $or: [{ status: 'New' }, { status: { $exists: false } }] });
    const carBookings = await CarBooking.countDocuments({ $or: [{ status: 'New' }, { status: { $exists: false } }] });
    const busBookings = await BusBooking.countDocuments({ $or: [{ status: 'New' }, { status: { $exists: false } }] });

    const contacts = await Contact.countDocuments();
    const packages = await Package.countDocuments();

    res.json({
      tourBookings,
      carBookings,
      busBookings,
      contacts,
      packages,
      totalNewActionable: tourBookings + carBookings + busBookings
    });
  } catch {
    res.status(500).json({ error: 'Failed to load dashboard counts' });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
