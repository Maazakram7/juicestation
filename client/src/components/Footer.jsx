import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t border-black/5 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <img src="/logo.png" alt="JUICEeSTATION" className="h-16 md:h-20 w-auto mb-6)]" />
            <p className="font-display text-2xl md:text-3xl leading-tight max-w-sm">
              Pure. Fresh.
              <br />
              <em className="not-italic text-brand-green-deep">
                No compromise.
              </em>
            </p>
            <p className="mt-6 text-sm opacity-60 max-w-sm leading-relaxed">
              Cold-pressed organic juices, made fresh in Bracknell, Berkshire.
              No water. No sugar. No additives. Nothing hidden.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-[0.2em] opacity-50 mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/menu" className="hover:text-brand-green-deep transition-colors">All juices</Link></li>
              <li><Link to="/builder" className="hover:text-brand-green-deep transition-colors">Build your own</Link></li>
              <li><Link to="/subscribe" className="hover:text-brand-green-deep transition-colors">Weekly subscription</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] opacity-50 mb-4">Visit</h4>
            <ul className="space-y-2.5 text-sm">
              <li>Bracknell</li>
              <li>Berkshire, UK</li>
              <li><a href="mailto:hello@juicestation.co.uk" className="hover:text-brand-green-deep transition-colors">hello@juicestation.co.uk</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] opacity-50 mb-4">Follow</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
  <a
    href="https://www.instagram.com/juiceestationuk/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
    aria-label="Follow JUICEeSTATION on Instagram"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
    <span className="text-sm">@juiceestationuk</span>
  </a>
</li>
              <li><a href="#" className="hover:text-brand-green-deep transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-brand-green-deep transition-colors">Google</a></li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark — editorial footer device */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.06 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="mt-20 pointer-events-none select-none"
        >
          <h2 className="font-display text-[13vw] md:text-[11vw] leading-none tracking-tighter text-center whitespace-nowrap">
            JUICE<span className="text-brand-melon">e</span>STATION
          </h2>
        </motion.div>

        <div className="mt-8 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs opacity-50">
          <p>© {new Date().getFullYear()} JUICEeSTATION. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Allergens</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
