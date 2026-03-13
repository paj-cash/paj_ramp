# PAJ Ramp SDK Examples

This directory contains complete, runnable examples demonstrating how to use the PAJ Ramp SDK in real-world scenarios.

## 📚 Available Examples

### [Onramp](./onramp)

**Difficulty:** Beginner
**What you'll learn:**

- Session management (initiate & verify)
- Creating onramp orders
- Fetching transaction details
- Handling bank account details for payment

Perfect for: Understanding the basic onramp flow where users buy crypto with fiat.

---

### [Offramp](./offramp)

**Difficulty:** Beginner
**What you'll learn:**

- Bank account verification and management
- Creating offramp orders
- Converting crypto to fiat

Perfect for: Understanding the reverse flow where users sell crypto for fiat.

---

### [Utility](./utility)

**Difficulty:** Beginner
**What you'll learn:**

- Fetching available banks
- Converting fiat amounts to token amounts (and vice versa)
- Fetching exchange rates

Perfect for: Building UI components like price quotes, bank selectors, and currency conversion displays.

---

### [Webhook Integration](./webhook-integration)

**Difficulty:** Intermediate
**What you'll learn:**

- Setting up webhook endpoints
- Handling order status updates in real-time
- Building a REST API for order tracking
- Production-ready webhook patterns

Perfect for: Building production applications that need real-time order updates.

---

## 🚀 Quick Start

Each example is self-contained with its own dependencies and README. To run any example:

```bash
cd examples/[example-name]
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

## 📋 Prerequisites

All examples require:

- Node.js 16 or higher
- A PAJ business API key ([Get one here](https://paj.cash))
- Basic knowledge of JavaScript/Node.js

Specific examples may have additional requirements (documented in their READMEs).

## 🎯 Learning Path

We recommend exploring the examples in this order:

1. **Start with [Onramp](./onramp)**
   Understand the fundamental flow of creating onramp orders

2. **Then try [Offramp](./offramp)**
   Learn the reverse process and bank account management

3. **Explore [Utility](./utility)**
   Discover helper functions for rates, banks, and value conversions

4. **Finally explore [Webhook Integration](./webhook-integration)**
   Build production-ready integrations with real-time updates

## 💡 Example Structure

Each example follows this structure:

```
example-name/
├── package.json          # Dependencies and scripts
├── index.ts              # Main application code
├── .env.example          # Environment variables template
└── README.md             # Detailed documentation
```

## 🔑 Getting Your API Key

To run these examples, you'll need a PAJ business API key:

1. Sign up at [paj.cash](https://paj.cash)
2. Complete business verification
3. Generate your API key from the dashboard
4. Add it to each example's `.env` file

## 🌍 Environment

All examples support both staging and production environments:

- **Staging**: For testing and development
- **Production**: For live transactions

Configure the environment in each example's `.env` file.

## 🆘 Getting Help

- 📖 Read the [main SDK documentation](../README.md)
- 🐛 [Report issues](https://github.com/paj-cash/paj_ramp/issues)
- 📧 Email: support@paj.cash

## 🤝 Contributing

Have an example you'd like to add? We welcome contributions!

1. Fork the repository
2. Create a new example following the existing structure
3. Submit a pull request

Good example ideas:

- Next.js/React integration
- Mobile app integration (React Native)
- Advanced error handling patterns
- Multi-currency support

## 📄 License

All examples are provided under the MIT License, same as the main SDK.

---

**Happy coding! 🎉**
