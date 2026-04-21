import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('id') || 'JS-XXXXX';
  const isSubscription = params.get('type') === 'subscription';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden">
      {/* Celebratory floating elements */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-20, -200 - i * 20],
            rotate: [0, 360 + i * 45],
            x: [0, (i % 2 === 0 ? 1 : -1) * (40 + i * 10)],
          }}
          transition={{
            duration: 3 + (i % 3),
            delay: i * 0.15,
            ease: 'easeOut',
          }}
          className="absolute bottom-0 w-3 h-3 rounded-full"
          style={{
            left: `${8 + i * 7}%`,
            backgroundColor: ['#7DC242', '#E94E4E', '#F39324'][i % 3],
          }}
        />
      ))}

      <div className="max-w-xl w-full text-center relative">
        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-brand-green/15 flex items-center justify-center mx-auto mb-8"
        >
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            stroke="#7DC242"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.polyline
              points="12 24 20 32 36 16"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            />
          </motion.svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4"
        >
          {isSubscription ? 'Subscription received' : 'Order confirmed'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="font-display text-5xl md:text-7xl leading-[0.95] mb-6"
        >
          {isSubscription ? 'Welcome.' : 'Thank you.'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="text-lg opacity-70 leading-relaxed mb-10 max-w-md mx-auto"
        >
          {isSubscription
            ? "We'll email you within 24 hours to confirm your first delivery date and set up billing. Your first Monday is going to be tasty."
            : "We'll press it fresh and get it to you. You'll get an email with the details shortly."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="inline-block px-6 py-4 rounded-2xl bg-white border border-black/[0.06] mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] opacity-50 mb-1">
            {isSubscription ? 'Subscription ID' : 'Order ID'}
          </p>
          <p className="font-mono text-lg tabular-nums">{orderId}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/" className="btn-ghost">Back home</Link>
          <Link to="/menu" className="btn-primary">Order again<span>→</span></Link>
        </motion.div>
      </div>
    </div>
  );
}
