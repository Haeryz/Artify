# Paddle Verification Guide for Artify

This guide explains how to complete the Paddle verification process for Artify, with specific guidance for our setup where the frontend and backend are deployed separately.

## Domain Verification

### Which Domain to Submit?

**Submit your frontend domain (Netlify)** for Paddle verification, not your backend domain. This is because:

1. Customers interact with your application through the frontend domain
2. The checkout process appears on your frontend domain
3. Policy pages (terms, privacy, refunds) should be accessible to customers on your frontend

For example, submit: `https://artify-app.netlify.app` (replace with your actual Netlify domain)

## Required Policy Pages

You need to create and host the following policy pages on your frontend:

1. **Terms and Conditions**
2. **Privacy Policy**
3. **Refund Policy**

### Where to Host Policy Pages

Create these pages on your frontend (Netlify) at URLs like:
- `https://artify-app.netlify.app/terms`
- `https://artify-app.netlify.app/privacy` 
- `https://artify-app.netlify.app/refunds`

### Implementation Steps

1. Create React components for each policy page in your frontend
2. Add routes for these pages in your router configuration
3. Link to these pages from your site footer
4. Submit these URLs during the Paddle verification process

## Example Implementation

### 1. Create Policy Components

Create React components for each policy in your frontend project:
- `src/pages/Terms.tsx`
- `src/pages/Privacy.tsx`
- `src/pages/Refunds.tsx`

### 2. Add Routes

Update your routing configuration to include these pages:

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/refunds" element={<Refunds />} />
  {/* ... other routes ... */}
</Routes>
```

### 3. Link in Footer

Update your site footer to include links to these policies.

## Paddle Backend Integration

While you submit your frontend domain, your backend still needs to:

1. Handle Paddle webhooks correctly
2. Validate the webhook signature
3. Process payment events

### Webhook URL Configuration

In your Paddle dashboard, set your webhook URL to point to your backend API endpoint:
```
https://your-backend-domain.azurewebsites.net/api/payments/webhook
```

### CORS Configuration

Ensure your backend CORS settings allow requests from your frontend domain:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL, // Your Netlify domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

## Final Checklist for Paddle Verification

- [ ] Frontend domain submitted for verification
- [ ] Terms and Conditions page created and accessible
- [ ] Privacy Policy page created and accessible
- [ ] Refund Policy page created and accessible
- [ ] Webhook URL configured in Paddle dashboard
- [ ] Backend properly validates Paddle webhooks
- [ ] Test payments completed successfully
- [ ] Company/business details submitted accurately

## Additional Tips

- Make your policy pages comprehensive and compliant with relevant laws (GDPR, CCPA, etc.)
- Consider consulting with a legal professional to review your policies
- Test your payment flow thoroughly before submitting for verification
- Ensure your backend properly handles all Paddle webhook events
