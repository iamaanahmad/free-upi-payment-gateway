# Security Policy

## Reporting a Vulnerability

The UPI Payment Gateway team takes security vulnerabilities seriously. If you discover a security vulnerability, please **do not** create a public GitHub issue. Instead, please report it responsibly.

### How to Report

1. **Email**: Send a detailed report to the maintainers (you can find contact info in the repository)
2. **Include**:
   - Description of the vulnerability
   - Affected versions
   - Steps to reproduce (if applicable)
   - Potential impact
   - Suggested fix (if you have one)

### Response Timeline

- **24 hours**: Initial acknowledgment of your report
- **7 days**: Assessment and confirmation of vulnerability
- **30 days**: Fix deployed and security advisory published

### Our Commitment

- We will acknowledge receipt of your report
- We will not publicly disclose the vulnerability until a fix is available
- We will credit you in the security advisory (if you wish)
- We will keep you updated on the progress

## Security Best Practices

When using UPI Payment Gateway in production:

### Environment Variables
- Never commit `.env` files or secrets to version control
- Use strong, unique secrets for all API keys
- Rotate secrets regularly

### Firebase Configuration
- Restrict Firestore rules to authenticated users only
- Regularly audit Firebase security rules
- Enable Firebase Authentication features appropriate for your use case

### Payment Data
- Validate all payment inputs server-side
- Never store sensitive payment information in plain text
- Use HTTPS/TLS for all communications

### Dependencies
- Keep dependencies up to date
- Run `npm audit` regularly to check for vulnerabilities
- Monitor security advisories

### Deployment
- Use environment-specific configurations
- Enable CORS restrictions appropriately
- Implement rate limiting on payment endpoints
- Add logging and monitoring for suspicious activity

## Supported Versions

| Version | Supported          |
|---------|-------------------|
| 1.x     | :white_check_mark: |
| 0.x     | :x:                |

Only the latest major version receives security updates.

## Security Updates

Security updates will be released as soon as a vulnerability is confirmed and fixed. Updates are released through:
- npm package updates
- GitHub releases
- Security advisories

## Thank You

We appreciate your responsible disclosure and help in making this project more secure!
