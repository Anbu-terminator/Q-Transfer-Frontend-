import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, Database, ArrowRight, Binary, Cpu, Key } from 'lucide-react';
import { CyberButton } from '@/components/CyberButton';
import { CyberCard, CyberCardContent } from '@/components/CyberCard';
import { QuantumOrb } from '@/components/QuantumParticles';

export default function HomePage() {
  const features = [
    {
      icon: Binary,
      title: 'Quantum Entropy',
      description: 'Chaotic map-based entropy generation using logistic and tent maps for unpredictable keystreams.',
      color: 'primary',
    },
    {
      icon: Key,
      title: 'Zero-Knowledge',
      description: 'Password never stored. Same file + different password = completely different output.',
      color: 'secondary',
    },
    {
      icon: Cpu,
      title: 'Stream Processing',
      description: 'Memory-efficient chunk-based processing for files of any size.',
      color: 'accent',
    },
    {
      icon: Database,
      title: 'Secure Storage',
      description: 'Encrypted binary chunks stored with entropy fingerprint and integrity hash.',
      color: 'primary',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text content */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Protocol v1.0
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-mono font-bold mb-6"
              >
                <span className="text-foreground">Q-TDFP</span>
                <br />
                <span className="text-primary glow-text">Quantum</span>
                <br />
                <span className="text-secondary">Entropy</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Trustless Data Flow Protocol with password-driven quantum entropy encryption. 
                No standard cryptography. Pure chaos-based security.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/encrypt">
                  <CyberButton size="lg" className="w-full sm:w-auto">
                    <Lock className="w-5 h-5" />
                    Encrypt File
                    <ArrowRight className="w-4 h-4" />
                  </CyberButton>
                </Link>
                <Link to="/decrypt">
                  <CyberButton variant="secondary" size="lg" className="w-full sm:w-auto">
                    <Zap className="w-5 h-5" />
                    Decrypt File
                  </CyberButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Visual element */}
            <motion.div 
              className="flex-1 relative h-[400px] w-full max-w-[500px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <QuantumOrb className="absolute inset-0 w-full h-full" />
              
              {/* Orbiting elements */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-16 h-16 text-primary absolute -top-32 left-1/2 -translate-x-1/2" />
              </motion.div>
              
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Lock className="w-12 h-12 text-secondary absolute -bottom-28 left-1/2 -translate-x-1/2" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <Key className="w-10 h-10 text-accent absolute top-1/2 -right-28 -translate-y-1/2" />
              </motion.div>

              {/* Center icon */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-full bg-card border border-primary/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.3)' }}
              >
                <Shield className="w-12 h-12 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
              <span className="text-foreground">Protocol</span>{' '}
              <span className="text-primary">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A revolutionary approach to data security using chaotic systems and entropy-based encryption.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard 
                  className="h-full"
                  glowColor={feature.color as 'cyan' | 'magenta' | 'purple'}
                >
                  <CyberCardContent>
                    <motion.div
                      className={`p-3 rounded-lg w-fit mb-4 ${
                        feature.color === 'primary' ? 'bg-primary/10 text-primary' :
                        feature.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                        'bg-accent/10 text-accent'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="w-6 h-6" />
                    </motion.div>
                    <h3 className="font-mono font-semibold text-lg mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CyberCardContent>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4">
              <span className="text-foreground">How It</span>{' '}
              <span className="text-secondary">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Encryption flow */}
            <CyberCard glowColor="cyan">
              <CyberCardContent>
                <h3 className="font-mono font-bold text-xl mb-6 text-primary flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Encryption Flow
                </h3>
                <div className="space-y-4">
                  {[
                    { step: '01', text: 'Upload your file' },
                    { step: '02', text: 'Set encryption password' },
                    { step: '03', text: 'Generate quantum entropy seed' },
                    { step: '04', text: 'Compress with quantum algorithm' },
                    { step: '05', text: 'XOR encrypt with chaotic keystream' },
                    { step: '06', text: 'Generate post-quantum hash' },
                    { step: '07', text: 'Store encrypted chunks' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="font-mono text-xs text-primary/60">{item.step}</span>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </CyberCardContent>
            </CyberCard>

            {/* Decryption flow */}
            <CyberCard glowColor="magenta">
              <CyberCardContent>
                <h3 className="font-mono font-bold text-xl mb-6 text-accent flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Decryption Flow
                </h3>
                <div className="space-y-4">
                  {[
                    { step: '01', text: 'Select encrypted file' },
                    { step: '02', text: 'Enter decryption password' },
                    { step: '03', text: 'Verify entropy fingerprint' },
                    { step: '04', text: 'Reconstruct entropy stream' },
                    { step: '05', text: 'Reverse XOR decryption' },
                    { step: '06', text: 'Decompress data' },
                    { step: '07', text: 'Stream file to download' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="font-mono text-xs text-accent/60">{item.step}</span>
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6">
              Ready to <span className="text-primary glow-text">Secure</span> Your Data?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Experience trustless encryption with quantum-level entropy. No keys stored. No backdoors.
            </p>
            <Link to="/encrypt">
              <CyberButton size="lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </CyberButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
