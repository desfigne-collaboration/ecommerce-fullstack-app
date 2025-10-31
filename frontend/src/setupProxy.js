const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Only proxy API requests to backend, not static files or HMR updates
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );

  // Proxy member-related endpoints
  app.use(
    '/member',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );

  // Proxy order-related endpoints
  app.use(
    '/order',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );

  // Proxy cart-related endpoints
  app.use(
    '/cart',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );

  // Proxy payment-related endpoints
  app.use(
    '/payment',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      logLevel: 'warn',
    })
  );
};
