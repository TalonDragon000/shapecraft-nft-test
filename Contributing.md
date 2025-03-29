# Contributing to ShapeNFT

Thank you for your interest in contributing to ShapeNFT! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Smart Contract Guidelines](#smart-contract-guidelines)
- [Testing](#testing)
- [Security](#security)
- [Making Pull Requests](#making-pull-requests)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/shapeNFT-test-v2.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Hardhat (v0.8.0 or higher)
- Solidity compiler (v0.8.0 or higher)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

## Smart Contract Guidelines

### Code Style & Best Practices

- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.0/style-guide.html)
- Use meaningful and consistent variable and function names
- Add comprehensive NatSpec comments for all public/external functions
- Keep functions small and focused
- Use events for important state changes
- Follow [ConsenSys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- Implement proper access control and reentrancy guards
- NEVER add private keys or other sensitive information (Use ``<PLACE-HOLDERS>`` instead)

### Gas Optimization

- Minimize storage reads/writes
- Use appropriate data types
- Optimize loops and conditions to mappings when able
- Consider using unchecked blocks where safe

## Testing

### Writing Tests

- Write tests for all new functionality
- Include both positive and negative test cases
- Test edge cases and boundary conditions
- Use descriptive test names

### Running Tests

```bash
npx hardhat test
# or
yarn test
```

## Security

This project has not been audited! Your efforts to improve its security is appreciated.

If you discover a security vulnerability:

1. Do not open a public issue
2. Email ``TalonDragon000@gmail.com``
3. Include detailed information about the vulnerability
4. Wait for our response before disclosing publicly

## Making Pull Requests

1. Update your branch with the latest changes:

```bash
git fetch origin
git rebase origin/main
```

2. Ensure all tests pass:

```bash
npm test
# or
yarn test
```

3. Create a detailed PR description including:
   - Purpose of the changes
   - Testing performed
   - Security considerations
   - Gas optimization details

## Code of Conduct

### Our Standards

Examples of positive behavior:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

Examples of unacceptable behavior:

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission

### Enforcement

Instances of abusive or harassing behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.