import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Upload, Download, Home, Lock } from 'lucide-react';
import { QuantumParticles } from './QuantumParticles';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/encrypt', label: 'Encrypt', icon: Upload },
    { path: '/decrypt', label: 'Decrypt', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <QuantumParticles />
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-30" />
      
      {/* Scanlines overlay */}
      <div className="scanlines" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Shield className="w-8 h-8 text-primary" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Lock className="w-8 h-8 text-accent opacity-30" />
                </motion.div>
              </motion.div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-lg text-primary glow-text">
                  Q-TDFP
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Quantum Protocol
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className="relative px-4 py-2"
                  >
                    <motion.div
                      className={`flex items-center gap-2 font-mono text-sm uppercase tracking-wider transition-colors ${
                        isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </motion.div>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        style={{ boxShadow: '0 0 10px hsl(var(--primary))' }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className="status-indicator status-locked" />
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                ENTROPY LOCK ACTIVE
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 pt-16 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-xl py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-mono">
              © 2024 Q-TDFP • Quantum Entropy Trustless Data Flow Protocol
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                v1.0.0-alpha
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-quantum-green animate-pulse" />
                <span className="text-xs text-quantum-green font-mono">SECURE</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
