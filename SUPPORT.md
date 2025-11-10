# Support

Thank you for using the UPI Payment Gateway! We're here to help if you need assistance.

## Getting Help

### 📚 Documentation
- Read the [README.md](README.md) for general information
- Check the [docs/](docs/) folder for detailed documentation
- Review [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

### 🐛 Bug Reports
Report bugs using GitHub Issues:
1. Search existing issues to avoid duplicates
2. Provide a clear, descriptive title
3. Include steps to reproduce the issue
4. Share relevant error messages or logs
5. Mention your environment (Node version, OS, etc.)

**Issue Template:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node version: 
- OS: 
- npm/yarn version: 
```

### 💡 Feature Requests
Have an idea to improve the project?
1. Check if a similar request already exists
2. Create an issue with the `enhancement` label
3. Describe the feature and why it would be useful
4. Include examples or mockups if relevant

### ❓ Questions & Discussions
- Use GitHub Discussions for general questions
- Share your use cases and experiences
- Help others with their questions

## Community Support Channels

### GitHub Issues
- Best for bugs and feature requests
- Search before posting
- Provide as much detail as possible

### GitHub Discussions
- Ideal for questions and discussions
- Share ideas and experiences
- Get feedback from the community

### Email
- For security vulnerabilities: See [SECURITY.md](SECURITY.md)
- For other inquiries: Check maintainer contact info in README

## Troubleshooting

### Common Issues

**Issue: Build fails with TypeScript errors**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run typecheck
```

**Issue: Environment variables not loading**
- Ensure `.env.local` exists in the root directory
- Copy from `.env.example` if needed
- Restart the development server

**Issue: Firebase connection errors**
- Verify Firebase credentials in `.env.local`
- Check Firebase console for project configuration
- Ensure Firestore is enabled in your Firebase project

**Issue: QR code not generating**
- Check if api.qrserver.com is accessible
- Verify the UPI link format is correct
- Check browser console for errors

## Before Asking for Help

1. **Search existing issues** - Your question might already be answered
2. **Check documentation** - Review README and docs folder
3. **Test locally** - Try to reproduce the issue in your environment
4. **Review logs** - Check browser console and server logs for errors
5. **Search Stack Overflow** - For general Node.js or Next.js questions

## Response Times

- **Bug reports**: Usually within 2-3 days
- **Feature requests**: Reviewed as capacity allows
- **Questions**: Community typically responds within 24 hours

## Code of Conduct

Please note that this project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Contributing

If you're interested in helping fix bugs or add features, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is open source and available under the MIT License. See [LICENSE](LICENSE) for details.

---

Thank you for being part of our community! 🙏
