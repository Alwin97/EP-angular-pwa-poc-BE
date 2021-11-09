const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  endpoint: {
    type: String,
  },
  expirationTime: {
    type: String,
    default: null,
  },
  keys: {
    p256dh: {
      type: String,
    },
    auth: {
      type: String,
    }
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
