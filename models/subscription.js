const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: String | null,
    required: true,
  },
  keys: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
