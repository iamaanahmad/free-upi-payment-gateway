# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dynamic amount input for payments without fixed amounts
- Real-time QR code regeneration based on user input
- Multi-language support (12 Indian languages)
- Comprehensive SEO optimization with structured data
- XML sitemap with hreflang alternates

### Changed
- Made amount field optional in payment creation forms
- Improved payment page UX with better error handling

### Fixed
- Runtime error when amount field is null/undefined

## [1.0.0] - 2025-11-10

### Added
- Initial release of UPI Payment Gateway
- Create and manage UPI payment links
- Generate QR codes for payments
- Embed payment widgets on external sites
- Dashboard for tracking payments
- Authentication system with Firebase
- Responsive design with Tailwind CSS
- International support with next-intl
- Firestore real-time updates
- Dark mode support
- Payment history tracking

### Features
- 🔗 Generate shareable UPI payment links
- 📱 Embeddable payment widgets
- 💾 Firebase Firestore integration
- 🌍 Multi-language support
- 📊 Payment dashboard
- 🔐 Secure authentication
- 🎨 Modern responsive UI
- 📈 SEO optimized

---

## Guidelines for Maintaining This Changelog

- Use "Added" for new features.
- Use "Changed" for changes in existing functionality.
- Use "Deprecated" for soon-to-be removed features.
- Use "Removed" for now removed features.
- Use "Fixed" for any bug fixes.
- Use "Security" in case of security vulnerabilities.

Each released version should have its own section with the format:
`## [Version] - YYYY-MM-DD`
