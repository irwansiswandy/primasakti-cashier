export default {
  // primasakti-api-server's configuration here...
  server: {
    host: 'localhost',
    port: 82,
    ssl: false
  },
  // laravel-websockets configuration here...
  pusher: {
    host: 'localhost',
    port: 6001,
    ssl: false,
    app_key: 'jnjZsGNnPsPwItDg',
    channels: [
      'primasakti-admin'
    ]
  }
};