import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Check, X, Loader2 } from 'lucide-react';

export type EncryptionStage = 
  | 'idle' 
  | 'reading' 
  | 'entropy' 
  | 'compressing' 
  | 'encrypting' 
  | 'hashing' 
  | 'storing' 
  | 'complete' 
  | 'error';

export type DecryptionStage =
  | 'idle'
  | 'verifying'
  | 'entropy'
  | 'decrypting'
  | 'decompressing'
  | 'validating'
  | 'complete'
  | 'error';

interface StageConfig {
  label: string;
  description: string;
}

const encryptionStages: Record<EncryptionStage, StageConfig> = {
  idle: { label: 'Ready', description: 'Waiting for file upload' },
  reading: { label: 'Reading File', description: 'Processing file data stream' },
  entropy: { label: 'Generating Entropy', description: 'Creating quantum entropy from password seed' },
  compressing: { label: 'Compressing', description: 'Applying quantum-inspired compression' },
  encrypting: { label: 'Encrypting', description: 'XOR encryption with chaotic keystream' },
  hashing: { label: 'Generating Hash', description: 'Creating post-quantum integrity hash' },
  storing: { label: 'Storing', description: 'Saving encrypted chunks to storage' },
  complete: { label: 'Complete', description: 'Encryption successful' },
  error: { label: 'Error', description: 'Encryption failed' },
};

const decryptionStages: Record<DecryptionStage, StageConfig> = {
  idle: { label: 'Ready', description: 'Waiting for file selection' },
  verifying: { label: 'Verifying', description: 'Checking entropy fingerprint' },
  entropy: { label: 'Reconstructing Entropy', description: 'Rebuilding entropy stream from password' },
  decrypting: { label: 'Decrypting', description: 'Reversing XOR encryption' },
  decompressing: { label: 'Decompressing', description: 'Restoring original data' },
  validating: { label: 'Validating', description: 'Verifying data integrity' },
  complete: { label: 'Complete', description: 'Decryption successful' },
  error: { label: 'Error', description: 'Wrong password or corrupted data' },
};

interface EncryptionVisualizerProps {
  stage: EncryptionStage;
  progress: number;
}

interface DecryptionVisualizerProps {
  stage: DecryptionStage;
  progress: number;
}

export function EncryptionVisualizer({ stage, progress }: EncryptionVisualizerProps) {
  const config = encryptionStages[stage];
  const stageOrder: EncryptionStage[] = ['reading', 'entropy', 'compressing', 'encrypting', 'hashing', 'storing', 'complete'];
  const currentIndex = stageOrder.indexOf(stage);

  return (
    <div className="space-y-6">
      {/* Stage indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className={`p-2 rounded-lg ${
                stage === 'complete' ? 'bg-quantum-green/20 text-quantum-green' :
                stage === 'error' ? 'bg-destructive/20 text-destructive' :
                'bg-primary/20 text-primary'
              }`}
            >
              {stage === 'complete' ? <Check className="w-5 h-5" /> :
               stage === 'error' ? <X className="w-5 h-5" /> :
               stage === 'idle' ? <Lock className="w-5 h-5" /> :
               <Loader2 className="w-5 h-5 animate-spin" />}
            </motion.div>
          </AnimatePresence>
          <div>
            <h4 className="font-mono font-semibold text-foreground">{config.label}</h4>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
        {stage !== 'idle' && stage !== 'complete' && stage !== 'error' && (
          <span className="font-mono text-primary text-sm">{Math.round(progress * 100)}%</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="quantum-progress">
        <motion.div
          className="quantum-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Stage steps */}
      <div className="flex justify-between">
        {stageOrder.slice(0, -1).map((s, i) => {
          const isComplete = currentIndex > i || stage === 'complete';
          const isCurrent = currentIndex === i;
          
          return (
            <motion.div
              key={s}
              className={`flex flex-col items-center gap-1 ${
                isComplete ? 'text-quantum-green' :
                isCurrent ? 'text-primary' :
                'text-muted-foreground'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-3 h-3 rounded-full border-2 ${
                isComplete ? 'bg-quantum-green border-quantum-green' :
                isCurrent ? 'bg-primary/20 border-primary animate-pulse' :
                'bg-transparent border-muted-foreground'
              }`} />
              <span className="text-[10px] font-mono uppercase">{encryptionStages[s].label.split(' ')[0]}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Entropy visualization */}
      {(stage === 'entropy' || stage === 'encrypting') && (
        <motion.div
          className="h-16 rounded-lg overflow-hidden bg-muted/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-full flex items-end gap-0.5 p-2">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-primary via-secondary to-accent rounded-t"
                initial={{ height: '10%' }}
                animate={{ height: `${Math.random() * 80 + 20}%` }}
                transition={{ 
                  duration: 0.2, 
                  repeat: Infinity, 
                  repeatType: 'reverse',
                  delay: i * 0.02 
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function DecryptionVisualizer({ stage, progress }: DecryptionVisualizerProps) {
  const config = decryptionStages[stage];
  const stageOrder: DecryptionStage[] = ['verifying', 'entropy', 'decrypting', 'decompressing', 'validating', 'complete'];
  const currentIndex = stageOrder.indexOf(stage);

  return (
    <div className="space-y-6">
      {/* Stage indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className={`p-2 rounded-lg ${
                stage === 'complete' ? 'bg-quantum-green/20 text-quantum-green' :
                stage === 'error' ? 'bg-destructive/20 text-destructive' :
                'bg-secondary/20 text-secondary'
              }`}
            >
              {stage === 'complete' ? <Check className="w-5 h-5" /> :
               stage === 'error' ? <X className="w-5 h-5" /> :
               stage === 'idle' ? <Unlock className="w-5 h-5" /> :
               <Loader2 className="w-5 h-5 animate-spin" />}
            </motion.div>
          </AnimatePresence>
          <div>
            <h4 className="font-mono font-semibold text-foreground">{config.label}</h4>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>
        {stage !== 'idle' && stage !== 'complete' && stage !== 'error' && (
          <span className="font-mono text-secondary text-sm">{Math.round(progress * 100)}%</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="quantum-progress">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: stage === 'error' 
              ? 'hsl(var(--destructive))' 
              : 'linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)',
            boxShadow: stage === 'error' 
              ? '0 0 20px hsl(var(--destructive) / 0.5)' 
              : '0 0 20px hsl(var(--secondary) / 0.5)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Stage steps */}
      <div className="flex justify-between">
        {stageOrder.slice(0, -1).map((s, i) => {
          const isComplete = currentIndex > i || stage === 'complete';
          const isCurrent = currentIndex === i;
          const isError = stage === 'error' && currentIndex === i;
          
          return (
            <motion.div
              key={s}
              className={`flex flex-col items-center gap-1 ${
                isError ? 'text-destructive' :
                isComplete ? 'text-quantum-green' :
                isCurrent ? 'text-secondary' :
                'text-muted-foreground'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-3 h-3 rounded-full border-2 ${
                isError ? 'bg-destructive border-destructive animate-pulse' :
                isComplete ? 'bg-quantum-green border-quantum-green' :
                isCurrent ? 'bg-secondary/20 border-secondary animate-pulse' :
                'bg-transparent border-muted-foreground'
              }`} />
              <span className="text-[10px] font-mono uppercase">{decryptionStages[s].label.split(' ')[0]}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Error animation */}
      {stage === 'error' && (
        <motion.div
          className="p-4 rounded-lg bg-destructive/10 border border-destructive/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ x: [-2, 2, -2, 2, 0] }}
              transition={{ duration: 0.4 }}
            >
              <X className="w-5 h-5 text-destructive" />
            </motion.div>
            <p className="text-sm text-destructive font-mono">
              Entropy mismatch detected. Invalid password or corrupted data.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
