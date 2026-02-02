# Leelu V2

E-commerce platform for relationship coaching programs with automated payment processing, Circle.so community integration, and personalized compatibility reports.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **State Management**: Zustand
- **Payment Processing**: Stripe Payment Intents API
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Community Platform**: Circle.so API
- **Email**: Nodemailer

## Project Structure

```
leelu-v2/
├── src/                          # Next.js frontend application
│   ├── app/                      # App router pages and API routes
│   │   ├── api/                  # Backend API endpoints
│   │   │   ├── create-payment-intent/    # Initialize Stripe payment
│   │   │   └── update-payment-intent/    # Update payment with billing data
│   │   ├── programs/             # Product pages
│   │   └── confirmation/         # Post-purchase pages
│   ├── components/               # React components
│   │   ├── sections/             # Page-specific sections
│   │   └── ui/                   # Reusable UI components
│   ├── store/                    # Zustand state management
│   │   ├── useCheckoutStore.ts   # Payment flow state
│   │   └── useProductStore.ts    # Product catalog cache
│   ├── lib/                      # External service clients
│   │   ├── stripe.ts             # Stripe client
│   │   ├── firebase.ts           # Firebase client
│   │   └── circle-api.ts         # Circle.so client
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Helper functions
│
└── functions/                    # Firebase Cloud Functions
    └── src/
        ├── functions/
        │   ├── stripe-circle-webhook.ts       # Stripe webhook handler
        │   ├── email.ts                       # Email sending functions
        │   └── program.ts                     # Program calculation functions
        ├── utils/
        │   ├── compatibility-report/          # Compatibility PDF generation
        │   ├── protocol-essentials/           # Protocol Essentials fulfillment
        │   ├── guided-breakthrough/           # Guided Breakthrough fulfillment
        │   └── vip-immersion/                 # VIP Immersion fulfillment
        └── lib/
            └── circle.ts                      # Circle.so API integration
```

## Product Types

### 1. Compatibility Report (`compatibility_report`)
- Generates personalized PDF compatibility analysis based on two birth dates
- Sends PDF via email
- No Circle.so integration
- Required metadata: `email`, `birth_date_1`, `birth_date_2`

### 2. Protocol Essentials (`protocol_essentials`)
- Online course with Circle.so community access
- Grants access to specific Circle space
- Required metadata: `email`, `name`, `space_id`

### 3. Guided Breakthrough (`guided_breakthrough`)
- Premium coaching program with Circle.so community access
- Grants access to specific Circle space
- Required metadata: `email`, `name`, `space_id`

### 4. VIP Immersion (`vip_immersion`)
- Exclusive program with Circle.so community access
- Grants access to specific Circle space
- Required metadata: `email`, `name`, `space_id`

## Payment Flow

### Frontend Flow

1. **Product Selection**: User selects a product from `/programs`
2. **Create Payment Intent**: 
   - Frontend calls `POST /api/create-payment-intent` with `productType`
   - Backend fetches product from Firestore (`offerings/{productType}`)
   - Creates Stripe PaymentIntent with metadata: `product_type`, `space_id` (if applicable), `intent_token`, `site`, `created_at`
   - Returns `clientSecret`, `intentId`, `intentToken`
3. **Billing Form**: User enters billing details (email, name, address, etc.)
4. **Update Payment Intent**:
   - Frontend calls `POST /api/update-payment-intent` with billing data
   - Backend verifies `intentToken` for security
   - Updates PaymentIntent metadata with billing info
   - Preserves original metadata (`space_id`, `created_at`, `intent_token`)
5. **Payment Submission**: User submits card details via Stripe Elements
6. **Success Redirect**: Redirected to `/confirmation` page

### Backend Flow (Webhook)

1. **Webhook Trigger**: Stripe sends `payment_intent.succeeded` event to Firebase Function
2. **Signature Verification**: Validates webhook signature
3. **Idempotency Check**: Prevents duplicate processing via Firestore `payments/{paymentIntentId}`
4. **Metadata Validation**: Ensures required fields present
5. **Product Routing**: Routes to specific handler based on `product_type`
6. **Fulfillment**:
   - **Compatibility Report**: Generates and emails PDF
   - **Circle Products**: Creates/finds member in Circle.so, grants space access
7. **Payment Record**: Saves payment details to Firestore

## Environment Variables

### Next.js Frontend (`.env.local`)

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=
STRIPE_SECRET_KEY_TEST=

# Domain
DOMAIN_URL=http://localhost:3000
```

### Firebase Functions (`.env` in `functions/`)

```bash
# Stripe
STRIPE_SECRET_KEY_TEST=
STRIPE_CIRCLE_WEBHOOK_SECRET=

# Circle.so
CIRCLE_API_KEY=
CIRCLE_COMMUNITY_ID=

# Email (Nodemailer)
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

## Firebase Configuration

### Firestore Collections

#### `offerings/{productType}`
Product catalog. Required fields:
```typescript
{
  price: number;           // Amount in cents (e.g., 9700 = $97.00)
  currency: string;        // "USD", "EUR", etc.
  name: string;            // Display name
  description: string;     // Product description
  space_id?: string;       // Circle.so space ID (for Circle products only)
}
```

#### `payments/{paymentIntentId}`
Payment records. Created by webhook for idempotency:
```typescript
{
  stripe_payment_intent_id: string;
  stripe_event_id: string;
  email: string;
  product_type: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
  created_at: Timestamp;
  processed_at: Timestamp;
}
```

### Storage Structure

```
gs://{bucket}/
└── pdf/
    ├── challenging/
    │   └── challenging.pdf
    ├── soulmate/
    │   └── soulmate.pdf
    └── karmic/
        └── karmic.pdf
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase CLI: `npm install -g firebase-tools`

### Installation

```bash
# Install frontend dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..
```

### Run Development Server

```bash
# Frontend
npm run dev

# Firebase Functions (local emulator)
cd functions
npm run serve
```

### Build

```bash
# Frontend
npm run build

# Functions
cd functions
npm run build
```

## Deployment

### Frontend (Vercel/Next.js)

```bash
npm run build
npm run start
```

### Firebase Functions

```bash
cd functions
npm run deploy
```

Configure Stripe webhook URL in Stripe Dashboard:
```
https://us-central1-{project-id}.cloudfunctions.net/stripeCircleWebhook
```

## Security Features

### Payment Intent Token Validation
Each PaymentIntent receives a unique `intent_token` (UUID) stored in metadata. When updating a PaymentIntent, the backend verifies:
- Token matches stored value
- Site domain matches (prevents cross-site attacks)
- Product type cannot be changed

### Webhook Signature Verification
All Stripe webhooks are verified using webhook signing secret to prevent spoofing.

### Idempotency
Payment processing is idempotent - duplicate webhook events are safely ignored by checking Firestore for existing payment records.

## API Endpoints

### `POST /api/create-payment-intent`
Creates Stripe PaymentIntent.

**Request:**
```typescript
{
  productType: "protocol_essentials" | "guided_breakthrough" | "vip_immersion" | "compatibility_report"
}
```

**Response:**
```typescript
{
  clientSecret: string;
  intentId: string;
  intentToken: string;
}
```

### `POST /api/update-payment-intent`
Updates PaymentIntent with billing information.

**Request:**
```typescript
{
  intentId: string;
  intentToken: string;
  productType: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  birthDate1?: string;  // Required for compatibility_report
  birthDate2?: string;  // Required for compatibility_report
}
```

**Response:**
```typescript
{
  ok: true;
  intentId: string;
  metadata: Record<string, string>;
}
```

## Circle.so Integration

### Architecture
- Community ID stored in environment variable (single community for entire platform)
- Space IDs stored per product in Firestore (`offerings/{productType}.space_id`)
- On successful payment, user is added to Circle community and granted access to product-specific space

### Flow
1. Webhook receives `space_id` from PaymentIntent metadata
2. Searches for existing Circle member by email
3. Creates new member if not found
4. Grants access to specified space
5. Member receives Circle invitation email

## Testing

### Test Stripe Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

Use any future expiry date, any 3-digit CVC, any ZIP code.

### Local Webhook Testing

Use Stripe CLI to forward webhooks:
```bash
stripe listen --forward-to http://localhost:5001/{project-id}/us-central1/stripeCircleWebhook
```

## Troubleshooting

### Missing `space_id` in webhook
- Verify `space_id` field exists in Firestore `offerings/{productType}` document
- Check create-payment-intent logs for product data
- Check update-payment-intent logs for metadata preservation

### Circle API errors
- Verify `CIRCLE_API_KEY` and `CIRCLE_COMMUNITY_ID` in functions environment
- Check Circle.so dashboard for API rate limits
- Verify space IDs are correct

### Email delivery failures
- Verify SMTP credentials in functions environment
- Check Firebase Functions logs for Nodemailer errors
- Verify sender email is authenticated with SMTP provider