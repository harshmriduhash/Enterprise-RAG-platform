# ✅ PRODUCTION CHECKLIST

**Purpose:** Ensure production-grade quality and reliability  
**Stage:** Pre-Production Deployment  
**Owner:** Engineering Team  
**Last Updated:** February 5, 2026

---

## 🏗️ PRODUCTION INFRASTRUCTURE

### Hosting & Compute
- [ ] Production server/VM provisioned
- [ ] Minimum specs met: 4GB RAM, 2 vCPU, 50GB storage
- [ ] Server hardened (security updates, firewall configured)
- [ ] SSH access secured (key-based only, no password)
- [ ] Non-root user created for application
- [ ] Automatic security updates enabled
- [ ] Monitoring agent installed
- [ ] Backup agent installed

### Database
- [ ] Production database configured (SQLite or upgrade to PostgreSQL)
- [ ] Database encryption enabled
- [ ] Automated backups configured (daily minimum)
- [ ] Backup restoration tested successfully
- [ ] Connection pooling configured
- [ ] Query performance optimized
- [ ] Indexes created on frequently queried columns
- [ ] Database size monitoring enabled

### Networking
- [ ] Static IP address assigned
- [ ] Domain name configured
- [ ] DNS records propagated (A, AAAA, CNAME)
- [ ] Firewall rules configured (allow only 80, 443, 22)
- [ ] DDoS protection enabled (Cloudflare or similar)
- [ ] CDN configured for static assets (optional)
- [ ] Port scanning protection active

---

## 🔒 SECURITY HARDENING

### SSL/TLS
- [ ] SSL certificate obtained (Let's Encrypt or paid)
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Certificate auto-renewal configured
- [ ] SSL Labs score A or better
- [ ] TLS 1.2+ only (disable older versions)
- [ ] HSTS header configured
- [ ] Secure cookie flags set

### Authentication & Authorization
- [ ] Strong password policy enforced (8+ chars, complexity)
- [ ] JWT secret is cryptographically secure (32+ chars)
- [ ] JWT token expiry configured (reasonable time)
- [ ] API keys use sufficient entropy
- [ ] Rate limiting on auth endpoints (prevent brute force)
- [ ] Account lockout after failed login attempts
- [ ] Email verification (optional for MVP, recommended for production)
- [ ] Password reset flow secure

### API Security
- [ ] All endpoints require authentication
- [ ] CORS whitelist configured (no wildcards in production)
- [ ] Input validation on all endpoints
- [ ] SQL injection protection verified
- [ ] XSS protection headers set
- [ ] CSRF tokens implemented (for state-changing operations)
- [ ] Request size limits configured
- [ ] File upload restrictions (type, size, scan for malware)

### Data Protection
- [ ] User passwords hashed (bcrypt, scrypt, or Argon2)
- [ ] API keys encrypted or hashed in database
- [ ] Sensitive data encrypted at rest
- [ ] Logs exclude passwords, API keys, tokens
- [ ] PII handling compliant with regulations
- [ ] Data retention policy defined
- [ ] Right to deletion implemented (GDPR if applicable)

### Infrastructure Security
- [ ] OS packages updated to latest stable versions
- [ ] Unnecessary services disabled
- [ ] Firewall configured (UFW, iptables, or cloud security group)
- [ ] Fail2ban or similar intrusion prevention installed
- [ ] Root login disabled
- [ ] SSH key rotation policy in place
- [ ] Audit logging enabled

---

## 📊 MONITORING & ALERTING

### Application Monitoring
- [ ] Health check endpoint (`/status`) implemented
- [ ] Uptime monitoring configured (Pingdom, UptimeRobot, etc.)
- [ ] Error tracking service integrated (Sentry, Rollbar, etc.)
- [ ] Performance monitoring (APM) configured
- [ ] Slow query alerts set up
- [ ] API response time monitoring
- [ ] Background job monitoring (if applicable)

### Infrastructure Monitoring
- [ ] CPU usage alerts (>80%)
- [ ] Memory usage alerts (>85%)
- [ ] Disk space alerts (<10% free)
- [ ] Network bandwidth monitoring
- [ ] Database connection pool monitoring
- [ ] SSL certificate expiry alerts (30 days before)

### Logging
- [ ] Centralized logging configured (CloudWatch, ELK, Papertrail)
- [ ] Log levels configured correctly (INFO/WARNING/ERROR)
- [ ] Log rotation enabled (max 7-30 days)
- [ ] Searchable logs (grep or log management tool)
- [ ] Error logs trigger alerts
- [ ] Audit logs for sensitive operations
- [ ] Logs comply with data protection laws

### Alerts
- [ ] Alert channels configured (email, SMS, Slack, PagerDuty)
- [ ] On-call rotation defined
- [ ] Alert thresholds tuned to avoid fatigue
- [ ] Critical vs warning alerts differentiated
- [ ] Runbooks created for common alerts
- [ ] Alert response time SLA defined

---

## 🚀 DEPLOYMENT & DEVOPS

### CI/CD Pipeline
- [ ] Git repository with production branch protected
- [ ] Automated testing on every commit
- [ ] Staging environment for pre-production testing
- [ ] Blue-green or canary deployment strategy
- [ ] Automated database migrations
- [ ] Rollback procedure documented and tested
- [ ] Deployment checklist automated where possible

### Environment Management
- [ ] Environment variables managed securely (not in code)
- [ ] Secrets management solution (AWS Secrets, HashiCorp Vault, etc.)
- [ ] Separate .env for dev/staging/production
- [ ] Config changes tracked in version control
- [ ] Feature flags for gradual rollouts (optional)

### Container Management (if using Docker)
- [ ] Docker images scanned for vulnerabilities
- [ ] Images published to private registry
- [ ] Image tags versioned properly (no :latest in production)
- [ ] Container resource limits set (CPU, memory)
- [ ] Container health checks configured
- [ ] Container restart policy set (unless-stopped)
- [ ] docker-compose.yml for production validated

### Orchestration (if using Kubernetes/Docker Swarm)
- [ ] Production cluster configured
- [ ] Resource quotas set per namespace
- [ ] Pod disruption budgets configured
- [ ] Horizontal pod autoscaling enabled
- [ ] Persistent volume backups automated
- [ ] Ingress controller configured
- [ ] Secrets managed via native orchestrator tools

---

## 📈 PERFORMANCE OPTIMIZATION

### Application Performance
- [ ] Database queries optimized (N+1 queries eliminated)
- [ ] Indexes created on all foreign keys
- [ ] Slow query log reviewed and addressed
- [ ] Connection pooling configured
- [ ] Caching layer implemented (Redis/Memcached) - optional for MVP
- [ ] Static assets minified and compressed
- [ ] Lazy loading for large datasets
- [ ] Pagination implemented for list endpoints

### Network Performance
- [ ] Gzip compression enabled
- [ ] HTTP/2 enabled
- [ ] Browser caching headers configured
- [ ] CDN for static assets (optional)
- [ ] DNS prefetching configured
- [ ] Keep-alive connections enabled

### Scalability Readiness
- [ ] Application is stateless (can run multiple instances)
- [ ] Session storage externalized (if applicable)
- [ ] File uploads stored in object storage (S3, GCS) - optional
- [ ] Load balancer configured (if multi-instance)
- [ ] Database connection limits tuned
- [ ] Horizontal scaling strategy documented

---

## 🧪 TESTING IN PRODUCTION

### Smoke Tests
- [ ] All critical user flows tested on production
- [ ] Signup/signin working
- [ ] API key creation working
- [ ] Document upload working
- [ ] Query execution working
- [ ] CSV export working
- [ ] Admin endpoints accessible

### Load Testing
- [ ] Baseline performance metrics captured
- [ ] Load test performed (10/100/1000 concurrent users)
- [ ] Identified bottlenecks and addressed
- [ ] Failure modes documented (what breaks first?)
- [ ] Auto-scaling triggers tested (if configured)

### Security Testing
- [ ] Vulnerability scan performed (Nessus, OpenVAS, etc.)
- [ ] Penetration test conducted (if budget allows)
- [ ] OWASP Top 10 checklist reviewed
- [ ] Dependency vulnerabilities scanned (npm audit, safety)
- [ ] No secrets exposed in public repos

---

## 📦 DISASTER RECOVERY

### Backup Strategy
- [ ] Database backed up daily (minimum)
- [ ] Backups tested for restoration
- [ ] Backups stored in separate location (off-site)
- [ ] Backup retention policy: 7 daily, 4 weekly, 12 monthly
- [ ] Configuration files backed up
- [ ] Code repository backed up (GitHub/GitLab handles this)
- [ ] Backup encryption enabled

### Recovery Procedures
- [ ] Restore from backup tested successfully
- [ ] Recovery Time Objective (RTO) defined: ______ hours
- [ ] Recovery Point Objective (RPO) defined: ______ hours
- [ ] Disaster recovery runbook created
- [ ] Emergency contact list documented
- [ ] Failover procedure documented and tested

### Business Continuity
- [ ] Single point of failure identified and mitigated
- [ ] Service degradation plan (what features to disable first?)
- [ ] Communication plan for outages
- [ ] Status page configured (statuspage.io or similar)
- [ ] Incident response team defined
- [ ] Post-mortem template prepared

---

## 📄 COMPLIANCE & LEGAL

### Data Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie policy (if using cookies beyond essentials)
- [ ] Data processing agreement template (for enterprise)
- [ ] GDPR compliance checklist (if serving EU customers)
- [ ] Data breach notification procedure
- [ ] User data export capability (right to portability)
- [ ] User data deletion capability (right to be forgotten)

### Security Compliance
- [ ] Security incident response plan documented
- [ ] Regular security audits scheduled
- [ ] Third-party service agreements reviewed
- [ ] Vendor security assessments completed
- [ ] SOC 2 / ISO 27001 roadmap (if targeting enterprise)

### Business Compliance
- [ ] Business entity registered
- [ ] Tax IDs obtained (GST, PAN, etc.)
- [ ] Contracts with customers legally reviewed
- [ ] Insurance coverage appropriate (E&O, cyber, etc.)
- [ ] Open source licenses compliant
- [ ] No GPL violations (if prohibited by business model)

---

## 📞 CUSTOMER SUPPORT READINESS

### Support Infrastructure
- [ ] Support email/ticketing system configured
- [ ] Support phone number (if offering phone support)
- [ ] Live chat configured (optional)
- [ ] Support hours clearly communicated
- [ ] SLA defined and documented
- [ ] Escalation paths defined
- [ ] Knowledge base created
- [ ] FAQ published

### Support Documentation
- [ ] User onboarding guide
- [ ] API documentation
- [ ] Troubleshooting guides
- [ ] Video tutorials (optional)
- [ ] Changelog published
- [ ] Release notes process
- [ ] Customer communication templates

### Support Team Readiness
- [ ] Support team trained on product
- [ ] Support playbooks created
- [ ] Common issues documented
- [ ] Support ticket response time targets set
- [ ] Customer satisfaction tracking (CSAT/NPS)
- [ ] Feedback loop to product/engineering

---

## 💰 BILLING & PAYMENTS (if applicable)

### Payment Processing
- [ ] Payment gateway integrated (Razorpay, Stripe, etc.)
- [ ] PCI DSS compliance ensured (don't store card data)
- [ ] Recurring billing configured
- [ ] Failed payment retry logic
- [ ] Payment notifications sent to customers
- [ ] Refund process documented
- [ ] Invoice generation automated

### Usage Tracking
- [ ] Usage metering accurate and tested
- [ ] Billing calculated correctly
- [ ] Usage alerts to customers (approaching limits)
- [ ] Overage handling defined
- [ ] Billing disputes process

---

## 🎯 PERFORMANCE BENCHMARKS

### Baseline Metrics (Document Current State)
- Query response time (p50): ______ ms
- Query response time (p95): ______ ms
- Query response time (p99): ______ ms
- Signup response time: ______ ms
- Document upload time (1MB): ______ seconds
- Concurrent users supported: ______
- Database size: ______ MB
- Memory usage: ______ MB
- CPU usage (idle): ______ %

### SLA Commitments
- [ ] Uptime SLA defined: ______ % (e.g., 99.9%)
- [ ] Response time SLA: ______ ms (e.g., <2000ms for queries)
- [ ] Support response time SLA: ______ hours
- [ ] SLA consequences documented (credits, refunds)

---

## ✅ PRODUCTION GO-LIVE APPROVAL

### Pre-Production Sign-Off
- [ ] Technical Lead: _______________ Date: ___________
- [ ] Security Review: _______________ Date: ___________
- [ ] Infrastructure: _______________ Date: ___________
- [ ] QA/Testing: _______________ Date: ___________
- [ ] Product Owner: _______________ Date: ___________
- [ ] Executive Sponsor: _______________ Date: ___________

### Production Deployment
- [ ] Deployment window scheduled
- [ ] Stakeholders notified
- [ ] Rollback plan reviewed
- [ ] Team on standby during deployment
- [ ] Post-deployment smoke tests passed
- [ ] Monitoring shows green across all systems

---

## 📊 POST-PRODUCTION MONITORING (First 30 Days)

### Week 1:
- [ ] Daily health checks
- [ ] Monitor error rates
- [ ] Review customer feedback
- [ ] Check performance metrics
- [ ] Verify backups running

### Week 2-4:
- [ ] Weekly performance reviews
- [ ] Security audit
- [ ] Capacity planning review
- [ ] Customer satisfaction survey
- [ ] Update documentation based on learnings

---

**Production Status:** 🔴 Not Ready | 🟡 In Progress | 🟢 Ready

**Current Status:** __________

**Blockers:** __________

**Go-Live Date:** __________
