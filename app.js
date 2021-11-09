const express = require('express')
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser')

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

app.post('/notifications', (req, res) => {
  console.log('test');
  console.log(req.body);
  res.status(200).json({message: "Subscription added successfully."});
})

app.post('/newsletter', (req, res) => {

  const allSubscriptions = [
    {
      endpoint: 'https://fcm.googleapis.com/fcm/send/c8EzBCQHW1I:APA91bGw0gsG-J_nRsiup5NdzqakWmGUygdtVu3SsvPF3lyHzIOYNoeb_C8b4qnBqtNnUN14gwqQj97bdZao4hXJb336b-NoHzbh6D9NQwJ7Rz2KHAkVNmKTyO9IePn2ScPW7Y7AAO7r',
      expirationTime: null,
      keys: {
        p256dh: 'BAfxkd580ggdyPI18W6TdAIVmAFB6aGu-GpX11qHmAR2777jgoiWr1Ug824FWrCMoH0RJyovl-dV2JeE1mub75o',
        auth: 'Zn1w2lnBI38TJtQhkfE6PA',
      }
    }
  ]

  console.log('Total subscriptions', allSubscriptions.length);

  const notificationPayload = {
    "notification": {
      "title": "Angular News",
      "body": "Newsletter Available!",
      "icon": "assets/icons/icon-144x144.png",
      "data": {
        "dateOfArrival": Date.now(),
        "primaryKey": 1
      },
      "actions": [{
        "action": "explore",
        "title": "Go to the site"
      }]
    }
  };

  Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
    sub, JSON.stringify(notificationPayload))))
    .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
    .catch(err => {
      console.error("Error sending notification, reason: ", err);
      res.sendStatus(500);
    });
})

// set port to listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`)
})
