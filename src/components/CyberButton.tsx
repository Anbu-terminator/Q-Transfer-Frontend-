import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary',
      secondary: 'border-secondary/50 bg-secondary/10 text-secondary hover:bg-secondary/20 hover:border-secondary',
      ghost: 'border-border/50 bg-transparent text-foreground hover:bg-muted hover:border-border',
      danger: 'border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:border-destructive',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    const glows = {
      primary: '0 0 20px hsl(var(--primary) / 0.4)',
      secondary: '0 0 20px hsl(var(--secondary) / 0.4)',
      ghost: 'none',
      danger: '0 0 20px hsl(var(--destructive) / 0.4)',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative font-mono font-semibold uppercase tracking-wider',
          'border rounded-lg overflow-hidden',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        style={{
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
        whileHover={!disabled && !loading ? { 
          scale: 1.02,
          boxShadow: glows[variant],
        } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        disabled={disabled || loading}
        {...props}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--${variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : variant === 'danger' ? 'destructive' : 'foreground'}) / 0.2), transparent)`,
          }}
          initial={false}
          whileHover={{ opacity: 1, x: ['0%', '100%'] }}
          transition={{ duration: 0.5 }}
        />

        {/* Content */}
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : null}
          {children}
        </span>

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-50" />
      </motion.button>
    );
  }
);

CyberButton.displayName = 'CyberButton';
