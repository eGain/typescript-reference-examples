# eGain Node.js Sample Application

A Node.js application demonstrating eGain API integration for retrieving chunks for a search query using OAuth 2.0 authentication.

## Prerequisites

- Node.js (v14 or higher)
- eGain API credentials (Client ID and Client Secret)

## Create a Client Application in eGain

1. Create a new client application following the guide: [To Create a Client Application](https://apidev.egain.com/developer-portal/get-started/authentication_guide/#to-create-a-client-application)
2. **Required Scopes**: Assign the following scopes to your client application:
   - `core.aiservices.read`
3. **Redirect URIs**: Configure the following URIs:
   - **Redirect URI**: `http://<hostname>/`
   - **Post Logout Redirect URI**: `http://<hostname>/`
   - **Platform**: Web
4. Save the **Client ID** for the next step.
5. Create a Client Secret. Make sure to save it immediately, as it will only be displayed once. 

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure `.env` with your credentials:
```env
EGAIN_CLIENT_ID=your_client_id
EGAIN_CLIENT_SECRET=your_client_secret
EGAIN_TOKEN_URL=https://your-instance.com/oauth2/token
EGAIN_PORTAL_ID=your_egain_portal_id
PORT=3000
```

## Usage

```bash
# Start server
npm start

# Development mode (auto-restart)
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/` | GET | API info | - |
| `/health` | GET | Health check | - |
| `/chunks` | GET | Search chunks | `q` (query string) |

### Example

```bash
curl "http://localhost:3000/chunks?q=password reset"
```

## Project Structure

```
node-sample/
├── server.js           # Express server & routes
├── auth.js             # OAuth 2.0 authentication
├── egainService.js     # eGain SDK wrapper
└── .env                # Configuration
```

## Authentication

Uses OAuth 2.0 Client Credentials flow with automatic token refresh.

## Troubleshooting

- **Authentication fails**: Verify `EGAIN_CLIENT_ID` and `EGAIN_CLIENT_SECRET`
- **Token error**: Check `EGAIN_TOKEN_URL` is correct
- **No results**: Verify `EGAIN_PORTAL_ID` and search query

## Dependencies

- `@egain/egain-api-typescript` - eGain SDK
- `express` - Web server
- `axios` - HTTP client
- `dotenv` - Environment config
- `cors` - CORS support
