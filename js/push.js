var webPush = require("web-push");

const vapidKeys = {
  publicKey:
    "BGspHsd7NU-AGARJ-1UMZsPppcmh5jQ5_Ou3o0WFoDHZz6vvycg7R6jw7FE79V1vbUqWC9ggsmNCFSKbpffqMdQ",
  privateKey: "du8uyRcoKGIj2DFDI98SZvY-CdKSUcmfvol1koy3lCk"
};

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

var pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/f8byXXh5UAo:APA91bHrsTRuZlJ6y28V57vjb7uAQDzjBlHomLDyO_Ky4YF3IKsA6YHAoDTX31x_xSdQuvxpKd_8YeRrgDrrbgOzpw9_RqYVcS_kRRvuVo_hDqpmcyVjHRmJQSBJ71CPG44_yFvD6N-z",
  keys: {
    p256dh:
      "BGDxoKOw6cMHV/sVMVBWX/N2le+asU6BnQNxzHdd5h8Y0B3b/jCc9evLuCX+ldgizsTMPSSSHor2M2KJ2C0+CMU=",
    auth: "nWPRP+aDqoXnax1tYHF5pA=="
  }
};

var payload = "Hola Glory Hunter!";

var options = {
  gcmAPIKey: "624109523977",
  TTL: 60
};

webPush.sendNotification(pushSubscription, payload, options);
