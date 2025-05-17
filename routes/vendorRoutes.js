const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: './uploads/documents/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'taxCertificate', maxCount: 1 }
]);

// Register new vendor
router.post('/register', upload, async (req, res) => {
  try {
    const vendorData = {
      ...req.body,
      documents: {
        businessLicense: req.files.businessLicense[0].path,
        taxCertificate: req.files.taxCertificate[0].path
      }
    };

    const vendor = new Vendor(vendorData);
    await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor registration submitted successfully',
      vendorId: vendor._id
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Update membership plan
router.post('/:id/membership', async (req, res) => {
  try {
    const { plan } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        membershipPlan: plan,
        membershipStatus: 'pending'
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Membership plan updated',
      vendor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get vendor details
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }
    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 