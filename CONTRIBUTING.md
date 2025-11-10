# Contributing to UPI Payment Gateway

Thank you for your interest in contributing to the UPI Payment Gateway project! We welcome contributions from the community and are grateful for any help you can provide.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/iamaanahmad/free-upi-payment-gateway.git
   cd free-upi-payment-gateway
   ```
3. **Add upstream remote** to stay in sync:
   ```bash
   git remote add upstream https://github.com/Centre-for-Information-Technology-India/upi-pg.git
   ```
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Git

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables (copy .env.example to .env.local)
cp .env.example .env.local

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
npm test             # Run tests
```

## Making Changes

### Code Style

- Follow the existing code style in the repository
- Use TypeScript for type safety
- Write clear, descriptive commit messages
- Keep components small and focused

### Commit Guidelines

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Changes to build process or dependencies

**Example:**
```
feat(payment): add dynamic amount input for flexible payments

- Allow users to enter custom amounts when no fixed amount is set
- Regenerate QR code in real-time as amount changes
- Disable pay button until valid amount is entered

Fixes #123
```

## Submitting Changes

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Write a clear PR description following the template

### Pull Request Requirements

- ✅ Tests pass (`npm test`)
- ✅ Type checking passes (`npm run typecheck`)
- ✅ No linting errors (`npm run lint`)
- ✅ Documentation is updated if needed
- ✅ Commit messages are clear and descriptive
- ✅ Changes follow the code style guidelines

## Areas for Contribution

### 🐛 Bug Reports
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide screenshots or error logs if possible

### ✨ Feature Requests
- Discuss major features in issues before implementation
- Consider backward compatibility
- Think about performance implications

### 📖 Documentation
- Improve README or other docs
- Fix typos or unclear explanations
- Add examples or tutorials

### 🧪 Testing
- Write tests for new features
- Improve test coverage
- Help with integration testing

## Code Review Process

All submissions are reviewed by maintainers. During the review:
- We may ask for changes or clarifications
- We'll provide constructive feedback
- Approval means your code is ready to merge

## Questions or Need Help?

- Check existing issues and discussions
- Ask in the GitHub Discussions section
- Open an issue with your question

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Commit history
- Release notes

Thank you for helping make UPI Payment Gateway better! 🙏
