const express = require('express')
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Subscription = require('./models/subscription');

const vapidKeys = {
  "publicKey": "BK50oaFrXUMC5p9jknpbzY7tCWuwGkAu6eQYe-UNDuTgmdEHQYiJCVHBuQY21_KpO80ctgvW3Fq_qgB_gl_EDR0",
  "privateKey": "xWYxPp06EZ0bcFfGKBrDSTX4kEvH5N8TDErCR44Fkdw"
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

webpush.setVapidDetails(
  'mailto:test@test.de',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// set port to listen for requests
const PORT = process.env.PORT || 8080;

const databaseUri = 'mongodb+srv://admin:nimda@ep-projekt-database.9tmj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(databaseUri)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server is running on Port', PORT)
    })
  })
  .catch(err => console.log(err));

app.post('/notifications', (req, res) => {
  console.log(req.body);
  new Subscription(req.body.sub).save()
    .then(() => {
      res.status(200).json({message: "Subscription added successfully."});
    })
    .catch(() => {
      console.log('Error creating subscription');
      res.status(500).json({message: 'Error creating subscription'})
    })
})

app.post('/newsletter', (req, res) => {

  const notificationPayload = req.body.notification;
  console.log(notificationPayload);

  Subscription.find({}).exec().then(data => {
    Promise.all(data.map(sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload))))
      .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
      .catch(err => {
        console.error("Error sending notification, reason: ", err);
        res.sendStatus(500);
      });
  })
})
