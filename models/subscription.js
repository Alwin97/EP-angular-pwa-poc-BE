const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: String,
    default: null,
    required: true
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    },
    required: true
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
