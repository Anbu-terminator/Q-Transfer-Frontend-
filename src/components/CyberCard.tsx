import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'purple';
  animate?: boolean;
}

export function CyberCard({ 
  children, 
  className,
  glowColor = 'cyan',
  animate = true 
}: CyberCardProps) {
  const glowColors = {
    cyan: 'hsl(var(--primary))',
    magenta: 'hsl(var(--accent))',
    purple: 'hsl(var(--secondary))',
  };

  return (
    <motion.div
      className={cn(
        'relative bg-card border border-border rounded-lg overflow-hidden',
        className
      )}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(220 25% 6%) 100%)',
        boxShadow: `0 0 1px ${glowColors[glowColor]}50, inset 0 0 30px ${glowColors[glowColor]}08`,
      }}
    >
      {/* Top gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${glowColors[glowColor]}15 0%, transparent 50%)`,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current opacity-30" 
           style={{ borderColor: glowColors[glowColor] }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current opacity-30"
           style={{ borderColor: glowColors[glowColor] }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current opacity-30"
           style={{ borderColor: glowColors[glowColor] }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current opacity-30"
           style={{ borderColor: glowColors[glowColor] }} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface CyberCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CyberCardHeader({ children, className }: CyberCardHeaderProps) {
  return (
    <div className={cn('p-6 border-b border-border/50', className)}>
      {children}
    </div>
  );
}

interface CyberCardContentProps {
  children: ReactNode;
  className?: string;
}

export function CyberCardContent({ children, className }: CyberCardContentProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}
