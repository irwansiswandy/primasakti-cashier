export default {
  // primasakti-api-server
  server: {
    host: '192.168.0.91',
    port: 82,
    ssl: false
  },
  // laravel-websockets
  pusher: {
    host: '192.168.0.91',
    port: 6001,
    ssl: false,
    app_key: 'jnjZsGNnPsPwItDg',
    channels: [
      'primasakti-admin'
    ]
  }
};