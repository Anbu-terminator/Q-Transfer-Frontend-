import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, Copy, Database } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardContent } from '@/components/CyberCard';
import { CyberButton } from '@/components/CyberButton';
import { FileDropzone } from '@/components/FileDropzone';
import { EncryptionVisualizer, EncryptionStage } from '@/components/EncryptionVisualizer';
import { DataStream } from '@/components/QuantumParticles';
import { uploadAndEncrypt, EncryptedFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function EncryptPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<EncryptionStage>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<EncryptedFile | null>(null);
  const [copied, setCopied] = useState<'fingerprint' | 'hash' | 'id' | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setResult(null);
    setStage('idle');
    setProgress(0);
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setStage('idle');
    setProgress(0);
  }, []);

  const handleEncrypt = useCallback(async () => {
    if (!selectedFile || !password) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Reading file
      setStage('reading');
      setProgress(0);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(1);

      // Generating entropy
      setStage('entropy');
      setProgress(0);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(0.5);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(1);

      // Compressing
      setStage('compressing');
      setProgress(0);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(0.5);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProgress(1);

      // Encrypting
      setStage('encrypting');
      setProgress(0);
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(0.5);

      // Hashing
      setStage('hashing');
      setProgress(0);
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(1);

      // Storing in database
      setStage('storing');
      setProgress(0);
      
      const encryptedFile = await uploadAndEncrypt(selectedFile, password);
      
      setProgress(1);

      // Complete
      setStage('complete');
      setResult(encryptedFile);

      toast({
        title: "Encryption complete",
        description: "Your file has been encrypted and stored in the database.",
      });

    } catch (error) {
      setStage('error');
      toast({
        title: "Encryption failed",
        description: error instanceof Error ? error.message : "An error occurred. Make sure the backend is running.",
        variant: "destructive",
      });
    }
  }, [selectedFile, password, toast]);

  const handleCopy = useCallback(async (type: 'fingerprint' | 'hash' | 'id', value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Copied",
      description: `${type === 'fingerprint' ? 'Entropy fingerprint' : type === 'hash' ? 'Integrity hash' : 'File ID'} copied to clipboard.`,
    });
  }, [toast]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPassword('');
    setStage('idle');
    setProgress(0);
    setResult(null);
  }, []);

  const isProcessing = stage !== 'idle' && stage !== 'complete' && stage !== 'error';

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-wider mb-4">
            <Lock className="w-3 h-3" />
            Encrypt Mode
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-2">
            Quantum <span className="text-primary glow-text">Encryption</span>
          </h1>
          <p className="text-muted-foreground">
            Secure your files with chaotic entropy-based encryption and store in MongoDB
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* File Upload */}
          <CyberCard>
            <CyberCardHeader>
              <h2 className="font-mono font-semibold text-lg flex items-center gap-2">
                <span className="text-primary">01</span>
                Select File
              </h2>
            </CyberCardHeader>
            <CyberCardContent>
              <FileDropzone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClearFile}
                disabled={isProcessing || stage === 'complete'}
              />
            </CyberCardContent>
          </CyberCard>

          {/* Password Input */}
          <CyberCard glowColor="magenta">
            <CyberCardHeader>
              <h2 className="font-mono font-semibold text-lg flex items-center gap-2">
                <span className="text-secondary">02</span>
                Set Password
              </h2>
            </CyberCardHeader>
            <CyberCardContent>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter encryption password (min 8 characters)"
                  className="cyber-input pr-12"
                  disabled={isProcessing || stage === 'complete'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isProcessing}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This password will seed the quantum entropy. Store it safely - it cannot be recovered.
              </p>
            </CyberCardContent>
          </CyberCard>

          {/* Encryption Process */}
          <CyberCard glowColor="purple">
            <CyberCardHeader>
              <h2 className="font-mono font-semibold text-lg flex items-center gap-2">
                <span className="text-accent">03</span>
                Encryption Process
              </h2>
            </CyberCardHeader>
            <CyberCardContent className="space-y-6">
              <DataStream active={isProcessing} />
              
              <EncryptionVisualizer stage={stage} progress={progress} />

              {stage === 'idle' && (
                <CyberButton
                  onClick={handleEncrypt}
                  disabled={!selectedFile || !password || password.length < 8}
                  className="w-full"
                >
                  <Lock className="w-5 h-5" />
                  Encrypt & Store in Database
                </CyberButton>
              )}
            </CyberCardContent>
          </CyberCard>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CyberCard glowColor="cyan">
                <CyberCardHeader>
                  <h2 className="font-mono font-semibold text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-quantum-green" />
                    Stored in Database
                  </h2>
                </CyberCardHeader>
                <CyberCardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Original Size</p>
                      <p className="font-mono text-lg text-foreground">{formatBytes(result.original_size)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Encrypted Size</p>
                      <p className="font-mono text-lg text-foreground">{formatBytes(result.encrypted_size)}</p>
                    </div>
                  </div>

                  {/* File ID */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">File ID (for decryption)</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 rounded-lg bg-quantum-green/10 border border-quantum-green/30 font-mono text-sm text-quantum-green overflow-x-auto">
                        {result.id}
                      </code>
                      <button
                        onClick={() => handleCopy('id', result.id)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {copied === 'id' ? <Check className="w-4 h-4 text-quantum-green" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Fingerprint */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Entropy Fingerprint</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 rounded-lg bg-muted/30 font-mono text-xs text-primary overflow-x-auto">
                        {result.fingerprint}
                      </code>
                      <button
                        onClick={() => handleCopy('fingerprint', result.fingerprint)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {copied === 'fingerprint' ? <Check className="w-4 h-4 text-quantum-green" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Hash */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-2">Integrity Hash</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 rounded-lg bg-muted/30 font-mono text-xs text-secondary overflow-x-auto">
                        {result.hash}
                      </code>
                      <button
                        onClick={() => handleCopy('hash', result.hash)}
                        className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {copied === 'hash' ? <Check className="w-4 h-4 text-quantum-green" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <Database className="w-5 h-5 text-primary" />
                    <p className="text-sm text-primary">
                      File securely stored in MongoDB. Remember your password to decrypt later.
                    </p>
                  </div>

                  <CyberButton onClick={handleReset} variant="ghost" className="w-full">
                    Encrypt Another File
                  </CyberButton>
                </CyberCardContent>
              </CyberCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
