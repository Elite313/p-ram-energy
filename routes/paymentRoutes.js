const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Vendor = require('../models/Vendor');

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { plan, vendorId } = req.body;

    const prices = {
      'silver': 799,
      'gold': 999,
      'platinum': 1999
    };

    if (!prices[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: prices[plan] * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        vendorId,
        plan
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Payment webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { vendorId, plan } = paymentIntent.metadata;

    // Update vendor membership status
    await Vendor.findByIdAndUpdate(vendorId, {
      membershipStatus: 'active',
      membershipPlan: plan,
      updatedAt: Date.now()
    });

    // Here you could also send a confirmation email to the vendor
  }

  res.json({ received: true });
});

module.exports = router; 