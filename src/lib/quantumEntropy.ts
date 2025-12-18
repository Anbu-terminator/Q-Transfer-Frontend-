/**
 * Q-TDFP Quantum Entropy Engine
 * 
 * Custom encryption using chaotic map-based entropy generation.
 * This is a demonstration implementation - NOT for production security use.
 * 
 * Key concepts:
 * - Logistic map chaos for pseudo-random entropy
 * - Password-seeded entropy stream
 * - XOR-based encryption with chaotic keystream
 * - Post-quantum style hash simulation
 */

// Logistic map chaos function: x(n+1) = r * x(n) * (1 - x(n))
function logisticMap(x: number, r: number = 3.99): number {
  return r * x * (1 - x);
}

// Tent map chaos function for additional entropy
function tentMap(x: number, mu: number = 1.99): number {
  return x < 0.5 ? mu * x : mu * (1 - x);
}

// Generate entropy seed from password
export function generateEntropySeed(password: string): number {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
    hash = hash ^ (hash >>> 16);
  }
  // Normalize to (0, 1) range avoiding fixed points
  const normalized = Math.abs(hash) / 2147483647;
  return Math.max(0.0001, Math.min(0.9999, normalized));
}

// Generate chaotic entropy stream
export function* entropyStream(seed: number, iterations: number = 1000): Generator<number> {
  let x = seed;
  let y = tentMap(seed);
  
  // Burn-in period for chaos stabilization
  for (let i = 0; i < 100; i++) {
    x = logisticMap(x);
    y = tentMap(y);
  }
  
  for (let i = 0; i < iterations; i++) {
    x = logisticMap(x);
    y = tentMap(y);
    // Combine both maps for enhanced entropy
    yield ((x + y) / 2 * 256) | 0;
  }
}

// Generate entropy fingerprint for verification
export function generateEntropyFingerprint(password: string): string {
  const seed = generateEntropySeed(password);
  const stream = entropyStream(seed, 32);
  const fingerprint: number[] = [];
  
  for (const byte of stream) {
    fingerprint.push(byte);
  }
  
  return fingerprint.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Post-quantum style hash simulation
export function quantumHash(data: Uint8Array, password: string): string {
  const seed = generateEntropySeed(password);
  let hash = new Uint8Array(32);
  
  // Initialize hash with entropy
  const initStream = entropyStream(seed, 32);
  let idx = 0;
  for (const byte of initStream) {
    hash[idx++] = byte;
  }
  
  // Mix data into hash
  for (let i = 0; i < data.length; i++) {
    const pos = i % 32;
    hash[pos] = (hash[pos] ^ data[i] ^ logisticMap(hash[pos] / 256) * 256) & 0xFF;
    
    // Diffusion step every 32 bytes
    if (i % 32 === 31) {
      for (let j = 0; j < 32; j++) {
        hash[j] = (hash[j] + hash[(j + 1) % 32]) & 0xFF;
      }
    }
  }
  
  // Final mixing rounds
  for (let round = 0; round < 16; round++) {
    for (let j = 0; j < 32; j++) {
      hash[j] = (hash[j] ^ hash[(j + 13) % 32]) & 0xFF;
      hash[j] = (hash[j] + logisticMap(hash[j] / 256) * 128) & 0xFF;
    }
  }
  
  return Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Compress data using quantum-inspired run-length encoding
export function quantumCompress(data: Uint8Array): Uint8Array {
  const result: number[] = [];
  let i = 0;
  
  while (i < data.length) {
    let runLength = 1;
    while (i + runLength < data.length && 
           data[i] === data[i + runLength] && 
           runLength < 255) {
      runLength++;
    }
    
    if (runLength >= 3) {
      // Encode run: [0xFF, length, value]
      result.push(0xFE, runLength, data[i]);
    } else {
      // Store raw bytes
      for (let j = 0; j < runLength; j++) {
        const byte = data[i + j];
        if (byte === 0xFE) {
          result.push(0xFE, 1, byte);
        } else {
          result.push(byte);
        }
      }
    }
    i += runLength;
  }
  
  return new Uint8Array(result);
}

// Decompress quantum-compressed data
export function quantumDecompress(data: Uint8Array): Uint8Array {
  const result: number[] = [];
  let i = 0;
  
  while (i < data.length) {
    if (data[i] === 0xFE && i + 2 < data.length) {
      const length = data[i + 1];
      const value = data[i + 2];
      for (let j = 0; j < length; j++) {
        result.push(value);
      }
      i += 3;
    } else {
      result.push(data[i]);
      i++;
    }
  }
  
  return new Uint8Array(result);
}

// Encrypt data using quantum entropy stream
export function quantumEncrypt(
  data: Uint8Array, 
  password: string,
  onProgress?: (progress: number) => void
): { encrypted: Uint8Array; fingerprint: string; hash: string } {
  const seed = generateEntropySeed(password);
  const fingerprint = generateEntropyFingerprint(password);
  
  // Compress first
  const compressed = quantumCompress(data);
  const encrypted = new Uint8Array(compressed.length + 8);
  
  // Store original length in first 4 bytes (big-endian)
  encrypted[0] = (data.length >>> 24) & 0xFF;
  encrypted[1] = (data.length >>> 16) & 0xFF;
  encrypted[2] = (data.length >>> 8) & 0xFF;
  encrypted[3] = data.length & 0xFF;
  
  // Store compressed length
  encrypted[4] = (compressed.length >>> 24) & 0xFF;
  encrypted[5] = (compressed.length >>> 16) & 0xFF;
  encrypted[6] = (compressed.length >>> 8) & 0xFF;
  encrypted[7] = compressed.length & 0xFF;
  
  // Generate keystream and encrypt
  const stream = entropyStream(seed, compressed.length);
  let idx = 8;
  let processedBytes = 0;
  
  for (const keyByte of stream) {
    if (idx - 8 >= compressed.length) break;
    encrypted[idx] = compressed[idx - 8] ^ keyByte;
    idx++;
    processedBytes++;
    
    if (onProgress && processedBytes % 1024 === 0) {
      onProgress(processedBytes / compressed.length);
    }
  }
  
  const hash = quantumHash(encrypted, password);
  
  return { encrypted, fingerprint, hash };
}

// Decrypt data using quantum entropy stream
export function quantumDecrypt(
  encrypted: Uint8Array,
  password: string,
  expectedFingerprint: string,
  expectedHash: string,
  onProgress?: (progress: number) => void
): Uint8Array | null {
  // Verify fingerprint
  const fingerprint = generateEntropyFingerprint(password);
  if (fingerprint !== expectedFingerprint) {
    return null;
  }
  
  // Verify hash
  const hash = quantumHash(encrypted, password);
  if (hash !== expectedHash) {
    return null;
  }
  
  // Extract lengths
  const originalLength = (encrypted[0] << 24) | (encrypted[1] << 16) | 
                         (encrypted[2] << 8) | encrypted[3];
  const compressedLength = (encrypted[4] << 24) | (encrypted[5] << 16) | 
                           (encrypted[6] << 8) | encrypted[7];
  
  const seed = generateEntropySeed(password);
  const compressed = new Uint8Array(compressedLength);
  
  // Generate keystream and decrypt
  const stream = entropyStream(seed, compressedLength);
  let idx = 0;
  
  for (const keyByte of stream) {
    if (idx >= compressedLength) break;
    compressed[idx] = encrypted[idx + 8] ^ keyByte;
    idx++;
    
    if (onProgress && idx % 1024 === 0) {
      onProgress(idx / compressedLength);
    }
  }
  
  // Decompress
  const decompressed = quantumDecompress(compressed);
  
  // Verify length
  if (decompressed.length !== originalLength) {
    return null;
  }
  
  return decompressed;
}

// Utility to convert ArrayBuffer to Uint8Array
export function arrayBufferToUint8Array(buffer: ArrayBuffer): Uint8Array {
  return new Uint8Array(buffer);
}

// Utility to download decrypted file
export function downloadFile(data: Uint8Array, filename: string, mimeType: string = 'application/octet-stream') {
  // Create a copy of the data to ensure it's a regular ArrayBuffer
  const buffer = new ArrayBuffer(data.length);
  const view = new Uint8Array(buffer);
  view.set(data);
  
  const blob = new Blob([buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
