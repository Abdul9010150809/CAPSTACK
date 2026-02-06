import crypto from 'crypto';

/**
 * CryptographicSecurity - Enterprise-grade encryption & security
 * Features: AES-256-GCM, SHA-256, Digital Signatures, PBKDF2
 * Production-ready cryptographic implementations for financial data protection
 */
export class CryptographicSecurity {
  private algorithm = 'aes-256-gcm';
  private keyLength = 32; // 256 bits
  private saltLength = 16; // 128 bits
  private tagLength = 16; // GCM tag length

  /**
   * Hash sensitive data using SHA-256
   */
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Encrypt data using AES-256-GCM
   * @param plaintext Data to encrypt
   * @param masterKey Master encryption key
   * @returns Encrypted data with IV and authentication tag
   */
  encryptData(plaintext: string, masterKey: string): {
    ciphertext: string;
    iv: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(masterKey, 'salt', 32);

    const cipher = crypto.createCipheriv(this.algorithm, key, iv) as any;
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param ciphertext Encrypted data
   * @param iv Initialization vector
   * @param authTag Authentication tag
   * @param masterKey Master encryption key
   * @returns Decrypted plaintext
   */
  decryptData(
    ciphertext: string,
    iv: string,
    authTag: string,
    masterKey: string
  ): string {
    const key = crypto.scryptSync(masterKey, 'salt', 32);
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(iv, 'hex')
    ) as any;

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Derive key from password using PBKDF2
   */
  deriveKey(password: string, salt?: Buffer): { key: Buffer; salt: Buffer } {
    const derivedSalt = salt || crypto.randomBytes(this.saltLength);
    const key = crypto.pbkdf2Sync(password, derivedSalt, 100000, 32, 'sha256');
    return { key, salt: derivedSalt };
  }

  /**
   * Generate digital signature using ECDSA
   */
  generateSignature(data: string, privateKey: string): string {
    const sign = crypto.createSign('sha256');
    sign.update(data);
    sign.end();

    return sign.sign(privateKey, 'hex');
  }

  /**
   * Verify digital signature
   */
  verifySignature(
    data: string,
    signature: string,
    publicKey: string
  ): boolean {
    const verify = crypto.createVerify('sha256');
    verify.update(data);
    verify.end();

    return verify.verify(publicKey, Buffer.from(signature, 'hex'));
  }

  /**
   * Generate HMAC for data integrity
   */
  generateHMAC(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verify HMAC
   */
  verifyHMAC(data: string, hmac: string, secret: string): boolean {
    const expectedHmac = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(expectedHmac)
    );
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash password securely (bcrypt-style, but cryptographic hash)
   */
  hashPassword(password: string, salt: Buffer = crypto.randomBytes(16)): {
    hash: string;
    salt: string;
  } {
    const hash = crypto
      .pbkdf2Sync(password, salt, 100000, 32, 'sha256')
      .toString('hex');
    return { hash, salt: salt.toString('hex') };
  }

  /**
   * Verify password
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: newHash } = this.hashPassword(password, Buffer.from(salt, 'hex'));
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(newHash));
  }

  /**
   * Generate zero-knowledge proof commitment
   */
  generateCommitment(secret: string, randomness: string): string {
    const combined = secret + randomness;
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  /**
   * Verify zero-knowledge proof commitment
   */
  verifyCommitment(
    commitment: string,
    secret: string,
    randomness: string
  ): boolean {
    const expectedCommitment = this.generateCommitment(secret, randomness);
    return commitment === expectedCommitment;
  }
}

export const cryptoSecurity = new CryptographicSecurity();
