module.exports = {
  devServer: {
    allowedHosts: 'all',
    host: 'localhost',
    port: 3001,
    client: {
      webSocketURL: 'ws://localhost:3001/ws',
    },
  },
};

