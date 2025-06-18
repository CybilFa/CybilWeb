// routes/complaint.routes.js
const express = require('express');
const router = express.Router();
const Complaint = require('../model/complaint.model');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

// Show complaint form
router.get('/contact-us', isAuthenticated, (req, res) => {
  res.render('contact', { cssFile: null });
});

// Handle complaint submission
router.post('/contact-us', isAuthenticated, async (req, res) => {
  const { orderId, message } = req.body;

  try {
    await Complaint.create({
      userId: req.session.user.id,
      orderId,
      message,
    });

    req.session.message = "Complaint submitted successfully.";
    res.redirect('/my-complaints');
  } catch (err) {
    console.error('Complaint error:', err);
    res.status(500).send('Error submitting complaint.');
  }
});

// Show user complaints
router.get('/my-complaints', isAuthenticated, async (req, res) => {
  const complaints = await Complaint.find({ userId: req.session.user.id }).sort({ submittedAt: -1 });
  res.render('my-complaints', { complaints, cssFile: null });
});

// Admin view
router.get('/admin/complaints', isAuthenticated, isAdmin, async (req, res) => {
  const complaints = await Complaint.find().populate('userId').sort({ submittedAt: -1 });
  res.render('admin-complaints', { complaints, cssFile: null });
});

module.exports = router;
