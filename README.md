# Node Bundler for ERC-4337 UserOperations

This project is a Node.js application implementing a bundler for Ethereum Account Abstraction (ERC-4337). The bundler enables efficient processing of UserOperations, adhering to the ERC-4337 standard.

## Features

- **UserOperations Support**: Handles UserOperations for Ethereum account abstraction.
- **Express.js API**: Provides REST endpoints for getting and submitting UserOperations.
- **Biconomy Integration**: Utilizes Biconomy's bundler service.
- **Flexible Configuration**: Environment variables for easy customization.
- **Unit and Integration Tests**: Comprehensive test coverage with `jest` and `supertest`.
- **API Documentation**: Clear API documentation using the `Bundler.postman_collection.json` file.

---

## Prerequisites

To run this project, you need:

- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest version
- **Ethereum Account Abstraction Knowledge**: Familiarity with ERC-4337 concepts

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nawar-hisso/node-bundler.git
   cd node-bundler
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   Or with Yarn:

   ```bash
   yarn install
   ```

3. Set up environment variables by creating a `.env` file in the root directory and adding the following (Explained also in the `.env.example` file):
   ```env
   PORT=3000
   VERSION=v1
   PROVIDER_URL=https://your-ethereum-provider-url
   PRIVATE_KEY=your-private-key
   CHAIN_ID=your-chain-id
   BUNDLER_URL=https://your-bundler-url
   BICONOMY_PAYMASTER_API_KEY=your-paymaster-api-key
   EOA_PRIVATE_KEYS=private-key1,private-key2
   ```

---

## Project Structure

- **`src/`**: Main application source code
  - **`controllers/`**: Contains controller logic
  - **`middleware/`**: Request validation logic
  - **`routes/`**: API route definitions
  - **`utils/`**: Utility functions
  - **`configs/`**: Application configuration
  - **`types/`**: Custom TypeScript definitions
- **`tests/`**: Test cases

---

## Usage

### Start the Application

Run the application in development mode:

```bash
npm start
```

Or with Yarn:

```bash
yarn start
```

The server will start at `http://localhost:<PORT>`.

### API Endpoints

#### `/v1/user-op` (POST)

- **Description**: Generates and signs a UserOperation.
- **Body Parameters**:
  - `to`: Target Ethereum address.
  - `amount`: Amount in Ether.
- **Response**: Returns a signed UserOperation.

#### `/v1/rpc` (POST)

- **Description**: Sends a signed UserOperation to the Ethereum entry point.
- **Body Parameters**:
  - `jsonrpc`: `2.0`.
  - `id`: `1`.
  - `method`: Must be `eth_sendUserOperation`.
  - `params`: Array containing the UserOperation and the entry point address.
- **Response**: Returns the transaction hash.

---

## Testing

Run all test cases using:

```bash
npm test
```

Or with Yarn:

```bash
yarn test
```

### Example Test Scenarios

1. **Valid UserOperation Generation**:

   - Sends a request to `/v1/user-op` with valid `to` and `amount`.
   - Verifies the response contains a `userOp`.

2. **Transaction Submission**:

   - Integration test to simulate calling of `/v1/user-op` and `/v1/user-op`.
   - Sends a request to `/v1/user-op` with valid `to` and `amount` to get and store the `userOp`.
   - Submits a valid `userOp` to `/v1/rpc`.
   - Verifies the response contains a transaction hash.

3. **Error Handling**:
   - Tests invalid requests for missing fields or invalid formats.

---

## Error Handling

The application uses a custom `CustomError` class for structured error management. Errors include:

- **ValidationError**: Missing or invalid fields.
- **MethodError**: Unsupported RPC method.
- **BlockchainError**: Issues with blockchain interaction.

Errors are returned in JSON-RPC format with appropriate HTTP status codes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Contact

For any questions or feedback:

- **Author**: Nawar Hisso
- **Email**: [nawwarhisso@gmail.com](mailto:nawwarhisso@gmail.com)
- **LinkedIn**: [Nawar Hisso](https://www.linkedin.com/in/nawarhisso/)
