const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  businessType: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  taxId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  division: {
    type: String,
    required: true,
    enum: ['petroleum', 'agriculture', 'pharmex']
  },
  products: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  documents: {
    businessLicense: {
      type: String,
      required: true
    },
    taxCertificate: {
      type: String,
      required: true
    }
  },
  membershipPlan: {
    type: String,
    required: true,
    enum: ['silver', 'gold', 'platinum']
  },
  membershipStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'active', 'expired']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vendor', vendorSchema); 