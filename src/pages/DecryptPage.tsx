import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Unlock, Eye, EyeOff, AlertTriangle, KeyRound } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardContent } from '@/components/CyberCard';
import { CyberButton } from '@/components/CyberButton';
import { DecryptionVisualizer, DecryptionStage } from '@/components/EncryptionVisualizer';
import { DataStream } from '@/components/QuantumParticles';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:8000';

export default function DecryptPage() {
  const [fileId, setFileId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<DecryptionStage>('idle');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleDecrypt = useCallback(async () => {
    if (!fileId || !password) {
      toast({
        title: 'Missing input',
        description: 'File ID and password are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      /* UI stages */
      setStage('verifying'); setProgress(0); await delay(400); setProgress(1);
      setStage('entropy'); setProgress(0); await delay(400); setProgress(1);
      setStage('decrypting'); setProgress(0); await delay(300); setProgress(0.7);

      /* Backend call */
      const form = new FormData();
      form.append('password', password);

      const response = await fetch(
        `${API_URL}/api/decrypt/${fileId}`,
        { method: 'POST', body: form }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Decryption failed');
      }

      const blob = await response.blob();

      /* Extract filename */
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'decrypted_file';
      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      setStage('decompressing'); setProgress(0); await delay(300); setProgress(1);
      setStage('validating'); setProgress(0); await delay(300); setProgress(1);
      setStage('complete');

      /* Download */
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast({
        title: 'Decryption successful',
        description: 'File decrypted and downloaded',
      });

    } catch (err: any) {
      setStage('error');
      toast({
        title: 'Decryption failed',
        description: err.message || 'Wrong password or invalid File ID',
        variant: 'destructive',
      });
    }
  }, [fileId, password, toast]);

  const isProcessing = !['idle', 'complete', 'error'].includes(stage);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-3xl space-y-8">

        {/* HEADER */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-mono font-bold">
            Quantum <span className="text-secondary">Decryption</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter File ID and password to decrypt and download
          </p>
        </motion.div>

        {/* FILE ID */}
        <CyberCard>
          <CyberCardHeader>
            <h2 className="font-mono flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              File ID
            </h2>
          </CyberCardHeader>
          <CyberCardContent>
            <input
              value={fileId}
              onChange={e => setFileId(e.target.value)}
              placeholder="Paste encrypted File ID"
              className="cyber-input"
              disabled={isProcessing}
            />
          </CyberCardContent>
        </CyberCard>

        {/* PASSWORD */}
        <CyberCard>
          <CyberCardHeader>Password</CyberCardHeader>
          <CyberCardContent>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter decryption password"
                className="cyber-input pr-12"
                disabled={isProcessing}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="flex gap-2 mt-3 p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-xs text-destructive">
                Wrong password or File ID will cause complete decryption failure.
              </p>
            </div>
          </CyberCardContent>
        </CyberCard>

        {/* PROCESS */}
        <CyberCard glowColor="cyan">
          <CyberCardContent className="space-y-6">
            <DataStream active={isProcessing} />
            <DecryptionVisualizer stage={stage} progress={progress} />

            {(stage === 'idle' || stage === 'error') && (
              <CyberButton
                onClick={handleDecrypt}
                disabled={!fileId || !password}
                className="w-full"
              >
                <Unlock className="w-5 h-5" />
                Decrypt & Download
              </CyberButton>
            )}
          </CyberCardContent>
        </CyberCard>

      </div>
    </div>
  );
}
