# HMR Hot-Update Proxy Error - Troubleshooting Guide

**Document Version:** 1.0
**Date:** 2025-10-31
**Issue Type:** Development Environment / HMR Configuration
**Status:** Resolved

## Issue Summary

When running `npm start` and making code changes, developers see proxy errors for Webpack Hot Module Replacement (HMR) update files. These errors appear as ECONNREFUSED for `*.hot-update.json` files.

## Error Messages

```
(node:8840) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated. Please use Object.assign() instead.

Proxy error: Could not proxy request /main.b34534c88042ac12fab8.hot-update.json from localhost:3000 to http://localhost:8080/.
See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (ECONNREFUSED).

Proxy error: Could not proxy request /main.ccfd7d0fb47b3c3b461e.hot-update.json from localhost:3000 to http://localhost:8080/.
See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (ECONNREFUSED).
```

## Root Cause Analysis

### What is HMR?

**Hot Module Replacement (HMR)** is Webpack's feature that:
- Updates code changes without full page refresh
- Preserves application state during development
- Creates `*.hot-update.json` and `*.hot-update.js` files
- These files exist in memory, not in `public/` folder

### Why the Proxy Error Occurs

```
Flow of HMR Request:
1. You save a code change in src/
2. Webpack creates: main.abc123.hot-update.json
3. Browser requests: http://localhost:3000/main.abc123.hot-update.json
4. React dev server checks: public/main.abc123.hot-update.json (NOT FOUND)
5. Falls back to proxy: http://localhost:8080/main.abc123.hot-update.json
6. Backend not running → ECONNREFUSED error
```

### The Global Proxy Problem

**Before (package.json):**
```json
{
  "proxy": "http://localhost:8080"
}
```

This global proxy setting means:
- **ALL requests** not found in `public/` are proxied to backend
- Including HMR files, which should be handled by Webpack dev server
- Results in unnecessary proxy errors for development files

## Impact Assessment

### Does This Break Anything?

**No, it doesn't!**

- ✅ HMR still works (code changes auto-reload)
- ✅ Application functions normally
- ✅ Only affects console cleanliness
- ✅ Production builds are unaffected

### When to Worry

You should fix this if:
- Console logs are cluttering your debugging workflow
- You want professional development environment
- Team members are confused by the errors
- You're setting up best practices

## Solution

### Fix: Use Selective Proxy Configuration

Instead of proxying everything, only proxy actual API endpoints.

### Step 1: Create setupProxy.js

Create `frontend/src/setupProxy.js`:

```javascript
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
```

### Step 2: Remove Global Proxy from package.json

**Before:**
```json
{
  "browserslist": {
    "development": [...]
  },
  "proxy": "http://localhost:8080"
}
```

**After:**
```json
{
  "browserslist": {
    "development": [...]
  }
}
```

### Step 3: Add http-proxy-middleware Dependency

**package.json:**
```json
{
  "dependencies": {
    "axios": "^1.12.2",
    "http-proxy-middleware": "^2.0.6",
    "react": "^19.1.1",
    ...
  }
}
```

### Step 4: Install and Restart

```bash
cd frontend
npm install
npm start
```

## How It Works

### Before (Global Proxy)

```
Request Flow:
/images/photo.webp     → Check public/ → Found ✓
/api/products          → Check public/ → Not found → Proxy to :8080 ✓
/main.abc.hot-update.json → Check public/ → Not found → Proxy to :8080 ✗ (ERROR)
```

### After (Selective Proxy)

```
Request Flow:
/images/photo.webp     → Check public/ → Found ✓
/api/products          → Match /api → Proxy to :8080 ✓
/member/login          → Match /member → Proxy to :8080 ✓
/main.abc.hot-update.json → No proxy rule → Handled by Webpack dev server ✓
```

## Benefits of This Approach

### 1. Clean Console

No more HMR proxy errors cluttering your console.

### 2. Explicit API Routes

Clear definition of which endpoints go to backend:
- `/api/*` - API endpoints
- `/member/*` - Authentication
- `/order/*` - Orders
- `/cart/*` - Shopping cart
- `/payment/*` - Payment processing

### 3. Better Performance

Webpack dev server handles HMR files directly without proxy overhead.

### 4. Team Clarity

New developers immediately see which backend endpoints exist.

## Alternative: Ignore the Errors

If you prefer to keep the simple global proxy:

```json
// package.json
{
  "proxy": "http://localhost:8080"
}
```

Just understand:
- HMR errors are cosmetic only
- No impact on functionality
- Can be ignored during development

## Verification

After applying the fix, verify:

```bash
npm start
```

Expected results:
- ✅ No proxy errors for `*.hot-update.json` files
- ✅ HMR still works (save a file, changes appear)
- ✅ API calls to `/api/*` still work (when backend running)
- ✅ Clean console output

## About DEP0060 Warning

```
(node:8840) [DEP0060] DeprecationWarning: The `util._extend` API is deprecated.
```

This warning is:
- **Not your fault** - comes from internal Node.js dependencies
- **Not critical** - doesn't affect functionality
- **Not fixable by you** - needs package maintainers to update
- **Will disappear** - when dependencies update their code

Common sources:
- `react-scripts` internals
- Older npm packages
- Webpack plugins

You can suppress it:
```bash
NODE_OPTIONS="--no-deprecation" npm start
```

But it's better to just ignore it until package updates arrive.

## Troubleshooting

### After Fix, API Calls Don't Work

**Problem:** Backend endpoints return 404

**Solution:** Make sure backend is running on port 8080
```bash
cd backend
./gradlew bootRun
# or
java -jar target/app.jar
```

### setupProxy.js Changes Not Applied

**Problem:** Still seeing HMR errors after creating setupProxy.js

**Solution:** Restart development server
```bash
# Kill npm start (Ctrl+C)
npm start
```

setupProxy.js is only loaded at startup.

### Added New API Endpoint, Not Proxied

**Problem:** New `/product/*` endpoints return errors

**Solution:** Add proxy rule to setupProxy.js
```javascript
app.use(
  '/product',
  createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    logLevel: 'warn',
  })
);
```

Restart `npm start` after changes.

## Project-Specific Proxy Routes

Current proxy configuration covers:

| Route | Purpose | Backend Controller |
|-------|---------|-------------------|
| `/api/*` | General API endpoints | Various controllers |
| `/member/*` | User authentication | MemberController |
| `/order/*` | Order management | OrderController (if exists) |
| `/cart/*` | Shopping cart | CartController (if exists) |
| `/payment/*` | Payment processing | PaymentController (if exists) |

### Adding New Routes

When backend adds new controllers:

1. Identify the base path (e.g., `/product`)
2. Add proxy rule in `setupProxy.js`
3. Restart frontend: `npm start`
4. Test the endpoint

Example:
```javascript
// New product search endpoint
app.use(
  '/search',
  createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
  })
);
```

## Best Practices

### 1. Match Backend Structure

Proxy paths should match your Spring Boot `@RequestMapping`:

```java
// Backend
@RestController
@RequestMapping("/api/products")
public class ProductController {
  ...
}
```

```javascript
// Frontend setupProxy.js
app.use('/api', createProxyMiddleware({ ... }));
```

### 2. Use Consistent Prefixes

Group related endpoints:
- `/api/*` - REST API
- `/auth/*` - Authentication
- `/public/*` - Public resources

### 3. Document Your Proxies

Add comments explaining each proxy rule:

```javascript
// Proxy product catalog endpoints to backend
app.use('/api/products', ...);

// Proxy user authentication
app.use('/auth', ...);
```

## Related Configuration

### CORS Configuration

If using proxy, backend still needs CORS for WebSocket connections:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*");
    }
}
```

### Environment Variables

For production, use environment variables:

```javascript
// setupProxy.js
const target = process.env.REACT_APP_API_URL || 'http://localhost:8080';

app.use('/api', createProxyMiddleware({ target }));
```

```bash
# .env.development
REACT_APP_API_URL=http://localhost:8080

# .env.production
REACT_APP_API_URL=https://api.yoursite.com
```

## Success Criteria

After implementing the fix:

- ✅ No HMR `*.hot-update.json` proxy errors
- ✅ Code changes still hot-reload instantly
- ✅ API calls work when backend is running
- ✅ Clear, clean console during development
- ✅ Team understands which endpoints are proxied
- ✅ New developers can easily add proxy rules

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-31 | Claude Code | Initial documentation of HMR proxy error fix |

---

**Last Updated:** 2025-10-31
**Maintained By:** Development Team
**Category:** Troubleshooting / Development Environment
**Related Docs:**
- [Proxy ECONNREFUSED Error](./proxy-econnrefused-error.md)
- [npm start Module Not Found Error](./npm-start-module-not-found-error.md)
