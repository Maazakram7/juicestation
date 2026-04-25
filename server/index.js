import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import subscriptionRoutes from './routes/subscriptions.js';
import stripeRoutes from './routes/stripe.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
  })
);

// CRITICAL: Stripe webhook MUST be mounted BEFORE express.json()
// because signature verification needs the raw request body.
app.use('/stripe', stripeRoutes);

app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ ok: true, service: 'juicestation-api', version: '1.0.0' });
});

app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🧃 JUICEeSTATION API running on http://localhost:${PORT}`);
});
