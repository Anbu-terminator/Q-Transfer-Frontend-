# Q-TDFP Backend Documentation

## Python FastAPI Backend Implementation

This document contains the complete Python backend code for Q-TDFP that you can run locally alongside the frontend.

---

## Project Structure

```
q-tdfp-backend/
├── main.py              # FastAPI application
├── quantum_engine.py    # Quantum entropy encryption engine
├── database.py          # MongoDB connection
├── models.py            # Pydantic models
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables
```

---

## requirements.txt

```txt
fastapi==0.109.0
uvicorn==0.27.0
motor==3.3.2
python-multipart==0.0.6
pydantic==2.5.3
python-dotenv==1.0.0
```

---

## .env

```env
MONGODB_URL=mongodb+srv://bastoffcial:aI4fEcricKXwBZ4f@speedo.swuhr8z.mongodb.net/
DATABASE_NAME=qtdfp
```

---

## quantum_engine.py

```python
"""
Q-TDFP Quantum Entropy Engine
Chaotic map-based encryption using logistic and tent maps.
"""

import struct
from typing import Generator, Tuple
from io import BytesIO


def logistic_map(x: float, r: float = 3.99) -> float:
    """Logistic map chaos function: x(n+1) = r * x(n) * (1 - x(n))"""
    return r * x * (1 - x)


def tent_map(x: float, mu: float = 1.99) -> float:
    """Tent map chaos function for additional entropy"""
    return mu * x if x < 0.5 else mu * (1 - x)


def generate_entropy_seed(password: str) -> float:
    """Generate entropy seed from password string"""
    hash_val = 0
    for char in password:
        hash_val = ((hash_val << 5) - hash_val + ord(char)) & 0xFFFFFFFF
        hash_val = hash_val ^ (hash_val >> 16)
    
    # Normalize to (0, 1) range avoiding fixed points
    normalized = abs(hash_val) / 2147483647
    return max(0.0001, min(0.9999, normalized))


def entropy_stream(seed: float, iterations: int = 1000) -> Generator[int, None, None]:
    """Generate chaotic entropy stream"""
    x = seed
    y = tent_map(seed)
    
    # Burn-in period for chaos stabilization
    for _ in range(100):
        x = logistic_map(x)
        y = tent_map(y)
    
    for _ in range(iterations):
        x = logistic_map(x)
        y = tent_map(y)
        # Combine both maps for enhanced entropy
        yield int(((x + y) / 2) * 256) & 0xFF


def generate_entropy_fingerprint(password: str) -> str:
    """Generate entropy fingerprint for verification"""
    seed = generate_entropy_seed(password)
    stream = entropy_stream(seed, 32)
    fingerprint = [next(stream) for _ in range(32)]
    return ''.join(f'{b:02x}' for b in fingerprint)


def quantum_hash(data: bytes, password: str) -> str:
    """Post-quantum style hash simulation"""
    seed = generate_entropy_seed(password)
    hash_bytes = bytearray(32)
    
    # Initialize hash with entropy
    init_stream = entropy_stream(seed, 32)
    for i in range(32):
        hash_bytes[i] = next(init_stream)
    
    # Mix data into hash
    for i, byte in enumerate(data):
        pos = i % 32
        hash_bytes[pos] = (hash_bytes[pos] ^ byte ^ int(logistic_map(hash_bytes[pos] / 256) * 256)) & 0xFF
        
        # Diffusion step every 32 bytes
        if i % 32 == 31:
            for j in range(32):
                hash_bytes[j] = (hash_bytes[j] + hash_bytes[(j + 1) % 32]) & 0xFF
    
    # Final mixing rounds
    for _ in range(16):
        for j in range(32):
            hash_bytes[j] = (hash_bytes[j] ^ hash_bytes[(j + 13) % 32]) & 0xFF
            hash_bytes[j] = (hash_bytes[j] + int(logistic_map(hash_bytes[j] / 256) * 128)) & 0xFF
    
    return hash_bytes.hex()


def quantum_compress(data: bytes) -> bytes:
    """Compress data using quantum-inspired run-length encoding"""
    result = bytearray()
    i = 0
    
    while i < len(data):
        run_length = 1
        while (i + run_length < len(data) and 
               data[i] == data[i + run_length] and 
               run_length < 255):
            run_length += 1
        
        if run_length >= 3:
            # Encode run: [0xFE, length, value]
            result.extend([0xFE, run_length, data[i]])
        else:
            # Store raw bytes
            for j in range(run_length):
                byte = data[i + j]
                if byte == 0xFE:
                    result.extend([0xFE, 1, byte])
                else:
                    result.append(byte)
        i += run_length
    
    return bytes(result)


def quantum_decompress(data: bytes) -> bytes:
    """Decompress quantum-compressed data"""
    result = bytearray()
    i = 0
    
    while i < len(data):
        if data[i] == 0xFE and i + 2 < len(data):
            length = data[i + 1]
            value = data[i + 2]
            result.extend([value] * length)
            i += 3
        else:
            result.append(data[i])
            i += 1
    
    return bytes(result)


def quantum_encrypt(data: bytes, password: str) -> Tuple[bytes, str, str]:
    """
    Encrypt data using quantum entropy stream.
    
    Returns:
        Tuple of (encrypted_data, fingerprint, hash)
    """
    seed = generate_entropy_seed(password)
    fingerprint = generate_entropy_fingerprint(password)
    
    # Compress first
    compressed = quantum_compress(data)
    
    # Create encrypted buffer with headers
    encrypted = bytearray()
    
    # Store original length (4 bytes, big-endian)
    encrypted.extend(struct.pack('>I', len(data)))
    
    # Store compressed length (4 bytes, big-endian)
    encrypted.extend(struct.pack('>I', len(compressed)))
    
    # Generate keystream and encrypt
    stream = entropy_stream(seed, len(compressed))
    for byte, key_byte in zip(compressed, stream):
        encrypted.append(byte ^ key_byte)
    
    encrypted_bytes = bytes(encrypted)
    hash_val = quantum_hash(encrypted_bytes, password)
    
    return encrypted_bytes, fingerprint, hash_val


def quantum_decrypt(
    encrypted: bytes,
    password: str,
    expected_fingerprint: str,
    expected_hash: str
) -> bytes | None:
    """
    Decrypt data using quantum entropy stream.
    
    Returns:
        Decrypted data or None if verification fails
    """
    # Verify fingerprint
    fingerprint = generate_entropy_fingerprint(password)
    if fingerprint != expected_fingerprint:
        return None
    
    # Verify hash
    hash_val = quantum_hash(encrypted, password)
    if hash_val != expected_hash:
        return None
    
    # Extract lengths
    original_length = struct.unpack('>I', encrypted[:4])[0]
    compressed_length = struct.unpack('>I', encrypted[4:8])[0]
    
    seed = generate_entropy_seed(password)
    compressed = bytearray()
    
    # Generate keystream and decrypt
    stream = entropy_stream(seed, compressed_length)
    for byte, key_byte in zip(encrypted[8:], stream):
        compressed.append(byte ^ key_byte)
    
    # Decompress
    decompressed = quantum_decompress(bytes(compressed))
    
    # Verify length
    if len(decompressed) != original_length:
        return None
    
    return decompressed
```

---

## models.py

```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


class EncryptedFileCreate(BaseModel):
    filename: str
    fingerprint: str
    hash: str
    original_size: int
    encrypted_size: int


class EncryptedFileResponse(BaseModel):
    id: str
    filename: str
    fingerprint: str
    hash: str
    original_size: int
    encrypted_size: int
    created_at: datetime
    chunk_count: int

    class Config:
        json_encoders = {ObjectId: str}


class DecryptRequest(BaseModel):
    file_id: str
    password: str
```

---

## database.py

```python
import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "qtdfp")


class Database:
    client: AsyncIOMotorClient = None
    db = None
    fs: AsyncIOMotorGridFSBucket = None


db = Database()


async def connect_db():
    db.client = AsyncIOMotorClient(MONGODB_URL)
    db.db = db.client[DATABASE_NAME]
    db.fs = AsyncIOMotorGridFSBucket(db.db)
    
    # Create indexes
    await db.db.files.create_index("fingerprint")
    await db.db.files.create_index("created_at")


async def close_db():
    db.client.close()


def get_database():
    return db.db


def get_gridfs():
    return db.fs
```

---

## main.py

```python
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
from datetime import datetime
from bson import ObjectId
import io

from database import connect_db, close_db, get_database, get_gridfs
from quantum_engine import quantum_encrypt, quantum_decrypt
from models import EncryptedFileCreate, EncryptedFileResponse, DecryptRequest


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Q-TDFP API",
    description="Quantum Entropy Trustless Data Flow Protocol",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "protocol": "Q-TDFP",
        "version": "1.0.0",
        "status": "active"
    }


@app.post("/api/encrypt", response_model=EncryptedFileResponse)
async def encrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    """
    Encrypt a file using quantum entropy encryption.
    """
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    # Read file data
    data = await file.read()
    
    # Encrypt
    encrypted, fingerprint, hash_val = quantum_encrypt(data, password)
    
    # Store in GridFS
    db = get_database()
    fs = get_gridfs()
    
    file_id = await fs.upload_from_stream(
        f"{file.filename}.qtdfp",
        io.BytesIO(encrypted),
        metadata={
            "original_filename": file.filename,
            "content_type": file.content_type,
        }
    )
    
    # Store metadata
    file_doc = {
        "_id": file_id,
        "filename": file.filename,
        "fingerprint": fingerprint,
        "hash": hash_val,
        "original_size": len(data),
        "encrypted_size": len(encrypted),
        "created_at": datetime.utcnow(),
        "chunk_count": 1,  # Could be calculated for large files
    }
    
    await db.files.insert_one(file_doc)
    
    return EncryptedFileResponse(
        id=str(file_id),
        filename=file.filename,
        fingerprint=fingerprint,
        hash=hash_val,
        original_size=len(data),
        encrypted_size=len(encrypted),
        created_at=file_doc["created_at"],
        chunk_count=1
    )


@app.get("/api/files")
async def list_files():
    """
    List all encrypted files.
    """
    db = get_database()
    files = []
    
    async for doc in db.files.find().sort("created_at", -1):
        files.append(EncryptedFileResponse(
            id=str(doc["_id"]),
            filename=doc["filename"],
            fingerprint=doc["fingerprint"],
            hash=doc["hash"],
            original_size=doc["original_size"],
            encrypted_size=doc["encrypted_size"],
            created_at=doc["created_at"],
            chunk_count=doc.get("chunk_count", 1)
        ))
    
    return files


@app.post("/api/decrypt/{file_id}")
async def decrypt_file(file_id: str, password: str = Form(...)):
    """
    Decrypt a file and stream it back.
    """
    db = get_database()
    fs = get_gridfs()
    
    # Get file metadata
    file_doc = await db.files.find_one({"_id": ObjectId(file_id)})
    if not file_doc:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Download encrypted data from GridFS
    encrypted_stream = io.BytesIO()
    await fs.download_to_stream(ObjectId(file_id), encrypted_stream)
    encrypted_stream.seek(0)
    encrypted_data = encrypted_stream.read()
    
    # Decrypt
    decrypted = quantum_decrypt(
        encrypted_data,
        password,
        file_doc["fingerprint"],
        file_doc["hash"]
    )
    
    if decrypted is None:
        raise HTTPException(
            status_code=400,
            detail="Decryption failed: wrong password or corrupted data"
        )
    
    # Stream response
    return StreamingResponse(
        io.BytesIO(decrypted),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{file_doc["filename"]}"'
        }
    )


@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str):
    """
    Delete an encrypted file.
    """
    db = get_database()
    fs = get_gridfs()
    
    try:
        await fs.delete(ObjectId(file_id))
        await db.files.delete_one({"_id": ObjectId(file_id)})
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## MongoDB Schema

```javascript
// Database: qtdfp

// Collection: files
{
  "_id": ObjectId,           // Also used as GridFS file_id
  "filename": String,        // Original filename
  "fingerprint": String,     // 64-char hex entropy fingerprint
  "hash": String,            // 64-char hex integrity hash
  "original_size": Number,   // Original file size in bytes
  "encrypted_size": Number,  // Encrypted file size in bytes
  "created_at": Date,        // Upload timestamp
  "chunk_count": Number      // Number of chunks (for streaming)
}

// Indexes
db.files.createIndex({ "fingerprint": 1 })
db.files.createIndex({ "created_at": -1 })

// GridFS collections (auto-created)
// fs.files - File metadata
// fs.chunks - Binary chunks (255KB each)
```

---

## Running the Backend

1. Install MongoDB locally or use MongoDB Atlas

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure .env file with your MongoDB URL

5. Run the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

6. API will be available at http://localhost:8000
   - Docs: http://localhost:8000/docs
   - Redoc: http://localhost:8000/redoc

---

## Connecting Frontend to Backend

Update the frontend to call the backend API instead of using client-side encryption:

```typescript
// Example API calls
const API_URL = 'http://localhost:8000';

// Encrypt
const formData = new FormData();
formData.append('file', file);
formData.append('password', password);
const response = await fetch(`${API_URL}/api/encrypt`, {
  method: 'POST',
  body: formData,
});

// Decrypt
const formData = new FormData();
formData.append('password', password);
const response = await fetch(`${API_URL}/api/decrypt/${fileId}`, {
  method: 'POST',
  body: formData,
});
const blob = await response.blob();
```
