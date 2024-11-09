# BSC Payment Validator 🔐

Simple payment validator for BSC network that checks if BNB and USDT transactions are legit. Uses Moralis to verify wallet addresses, amounts, and timestamps from transaction hashes. Added some safety checks to catch wrong payments and keep things secure.

## Setup 🚀

1. **Get Moralis API Key**
   - Go to [Moralis](https://moralis.io/)
   - Sign up or login to your account
   - Go to Web3 APIs in the dashboard
   - Create a new API key or use an existing one
   - Copy your API key

2. **Environment Setup**
   - Create a `.env.local` file in the root directory
   - Add your Moralis API key:
   ```env
   NEXT_PUBLIC_MORALIS_API_KEY=your-api-key-here
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the Project**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Features ✨

- Validates BNB and USDT transactions on BSC network
- Checks wallet addresses
- Verifies transaction amounts
- Validates transaction timestamps
- 98% minimum amount threshold
- 1-hour time window validation

## Usage 💡

```typescript
// Example API call
const response = await fetch('/api/validate/transaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    transactionHash: '0x...',
    wallet: '0x...',
    amount: '100',
    currency: 'BNB'  // or 'USDT'
  }),
});
```

## Error Handling 🚨

The validator returns different status codes:
- `200`: Transaction is valid
- `400`: Invalid parameters or transaction
- `500`: Server error

## Contributing 🤝

Feel free to submit issues and pull requests.

## License 📝

MIT