import { Request, Response, NextFunction } from 'express';
import { cryptoSecurity } from './CryptographicSecurity';

/**
 * SecurityAuditor - Tracks and logs all security events
 * Implements comprehensive security monitoring and compliance logging
 */
export interface SecurityEvent {
  eventId: string;
  eventType:
    | 'AUTH_ATTEMPT'
    | 'DATA_ACCESS'
    | 'PRIVILEGE_ESCALATION'
    | 'ENCRYPTION_KEY_ROTATION'
    | 'SUSPICIOUS_ACTIVITY';
  userId?: string;
  ipAddress: string;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  metadata: Record<string, any>;
}

export class SecurityAuditor {
  private events: SecurityEvent[] = [];
  private suspiciousPatterns = new Map<string, number>();

  /**
   * Log security event
   */
  logSecurityEvent(event: Omit<SecurityEvent, 'eventId' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      eventId: cryptoSecurity.generateToken(16),
      timestamp: new Date(),
    };

    this.events.push(securityEvent);

    // Check for suspicious patterns
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      this.flagSuspiciousActivity(event.userId || event.ipAddress);
    }

    console.log(`[SECURITY AUDIT] ${event.eventType}: ${event.description}`);
  }

  /**
   * Track suspicious patterns
   */
  private flagSuspiciousActivity(identifier: string): void {
    const count = this.suspiciousPatterns.get(identifier) || 0;
    this.suspiciousPatterns.set(identifier, count + 1);

    if (count + 1 >= 3) {
      console.warn(`⚠️  ALERT: Multiple suspicious activities detected for ${identifier}`);
    }
  }

  /**
   * Get audit trail for user
   */
  getAuditTrail(userId: string, limit: number = 100): SecurityEvent[] {
    return this.events
      .filter((e) => e.userId === userId)
      .slice(-limit);
  }

  /**
   * Get security incidents
   */
  getSecurityIncidents(): SecurityEvent[] {
    return this.events.filter((e) => e.severity === 'HIGH' || e.severity === 'CRITICAL');
  }

  /**
   * Export audit logs (GDPR/HIPAA compliance)
   */
  exportAuditLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.events, null, 2);
    }

    // CSV format
    const headers = [
      'EventID',
      'EventType',
      'UserID',
      'IPAddress',
      'Timestamp',
      'Severity',
      'Description',
    ];
    const rows = this.events.map((e) => [
      e.eventId,
      e.eventType,
      e.userId || 'N/A',
      e.ipAddress,
      e.timestamp.toISOString(),
      e.severity,
      e.description,
    ]);

    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }
}

export const securityAuditor = new SecurityAuditor();

/**
 * Middleware for security auditing
 */
export function securityAuditingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log suspicious activities
    if (res.statusCode === 401 || res.statusCode === 403) {
      securityAuditor.logSecurityEvent({
        eventType: 'AUTH_ATTEMPT',
        userId: (req as any).userId,
        ipAddress: req.ip || 'unknown',
        severity: 'MEDIUM',
        description: `Authentication/Authorization failure: ${req.method} ${req.path}`,
        metadata: {
          statusCode: res.statusCode,
          duration,
          userAgent: req.headers['user-agent'],
        },
      });
    }

    // Log slow requests (potential attack)
    if (duration > 5000) {
      securityAuditor.logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        userId: (req as any).userId,
        ipAddress: req.ip || 'unknown',
        severity: 'LOW',
        description: `Slow request detected: ${duration}ms`,
        metadata: {
          path: req.path,
          method: req.method,
        },
      });
    }
  });

  next();
}
