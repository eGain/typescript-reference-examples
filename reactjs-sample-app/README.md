# eGain AI Search Demo

A React application demonstrating OAuth 2.0 PKCE (Proof Key for Code Exchange) authentication flow integrated with eGain AI-powered knowledge search capabilities.

## Features

- **Secure Authentication**: OAuth 2.0 with PKCE flow
- **AI-Powered Search**: eGain knowledge base search with intelligent results
- **Modern Stack**: React 18, Vite, React Router
- **Responsive UI**: Clean, user-friendly interface
- **Token Management**: Automatic token refresh and secure storage

## Prerequisites

- Node.js 16+ and npm
- eGain tenant account with Admin access
- A fully qualified hostname (localhost is not supported for CORS)

## 🔧 Configuration

### Step 1: Create a Client Application in eGain

1. Create a new client application following the guide: [To Create a Client Application](https://apidev.egain.com/developer-portal/get-started/authentication_guide/#to-create-a-client-application)
2. **Required Scopes**: Assign the following scopes to your client application:
   - `knowledge.portalmgr.read`
   - `core.aiservices.read`
3. **Redirect URIs**: Configure the following URIs:
   - **Redirect URI**: `http://<hostname>/`
   - **Post Logout Redirect URI**: `http://<hostname>/`
   - **Platform**: Single Page Application
4. Save the **Client ID** for the next step

### Step 2: Enable CORS

1. Navigate to eGain Admin Console → **Partition** → **Security** → **CORS Settings**
2. Add `http://<hostname>` to the **Allowed Origins** list
3. **Note**: `localhost` is not permitted in CORS settings; use your actual hostname

### Step 3: Configure the Application

Edit the configuration files with your tenant-specific details:

#### `src/authConfig.js`

```javascript
const tenantId = "<tenant_id>"; // e.g., "TMDEVEB72550565"
const hostname = "<hostname>"; // a fully qualifies domain name e.g., "myserver.example.com"

export const authConfig = {
  client_id: "<client_id>", // Client ID from Step 1
  // ... other settings are auto-configured
};
```

**Required Values**:

- `tenantId`: Your eGain Tenant ID
- `hostname`: Your machine's hostname (not localhost)
- `eGainDomain`: Your eGain domain URL
- `client_id`: Client application ID from Step 1

#### `src/egainConfig.js`

```javascript
export const egainConfig = {
  portalID: "YOUR_PORTAL_ID", // e.g., "PZ-9999"
  language: "en-US",
  acceptLanguage: "en-US",
};
```

**Required Values**:

- `portalID`: eGain Portal ID for knowledge search

#### `vite.config.js`

Update the `allowedHosts` array with your hostname:

```javascript
server: {
  allowedHosts: ["<hostname>", "localhost", "127.0.0.1"],
}
```

## 📦 Installation & Running

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start Development Server**:

   ```bash
   npm run dev
   ```

3. **Access the Application**:
   Open your browser and navigate to:
   ```
   http://<hostname>/
   ```

## Available Scripts

- `npm run dev` - Start development server on port 80
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run lint:fix` - Automatically fix linting issues

## Project Structure

```
sample-app/
├── src/
│   ├── main.jsx           # Application entry point
│   ├── App.jsx            # Main component with routing logic
│   ├── authConfig.js      # OAuth/OIDC configuration
│   ├── authService.js     # Authentication service (UserManager wrapper)
│   ├── AuthContext.jsx    # React Context for auth state management
│   ├── egainConfig.js     # eGain API configuration
│   ├── Login.jsx          # Login page component
│   ├── Search.jsx         # AI Search component with eGain integration
│   ├── Header.jsx         # Application header with user info
│   └── index.css          # Global styles
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
└── index.html             # HTML entry point
```

## Key Dependencies

| Package                       | Version | Purpose                   |
| ----------------------------- | ------- | ------------------------- |
| `react`                       | 18.2.0  | UI framework              |
| `react-dom`                   | 18.2.0  | React DOM rendering       |
| `react-router-dom`            | 6.20.1  | Client-side routing       |
| `oidc-client-ts`              | 2.4.0   | OAuth/OIDC authentication |
| `@egain/egain-api-typescript` | 0.3.9   | eGain API SDK             |
| `vite`                        | 5.0.8   | Build tool and dev server |

## How It Works

1. **Authentication Flow**:

   - User clicks "Login" → Redirected to eGain OIDC provider
   - User authenticates → PKCE challenge/verifier validated
   - Authorization code exchanged for access token
   - User redirected back with active session

2. **Search Flow**:
   - User enters search query
   - Request sent to eGain API with access token
   - AI-powered results returned and displayed
   - Article details can be expanded inline

## Browser Compatibility

Requires modern browsers with support for:

- ES6+ JavaScript (modules, arrow functions, async/await)
- Web Crypto API (for PKCE code generation)
- Fetch API
- Local Storage (for session state)

**Tested Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Troubleshooting

| Issue                       | Cause                      | Solution                                                             |
| --------------------------- | -------------------------- | -------------------------------------------------------------------- |
| **CORS Error**              | Origin not allowed         | Add `http://<hostname>` to CORS settings in eGain Admin Console |
| **Redirect URI Mismatch**   | URI not registered         | Verify redirect URI matches exactly in client app settings           |
| **Invalid Client ID**       | Wrong client ID            | Double-check client ID in `src/authConfig.js`                        |
| **401 Unauthorized**        | Missing/expired token      | Check scopes are assigned to client app; try logging out and back in |
| **Port 80 in use**          | Another service on port 80 | Change port in `vite.config.js` (line 16)                            |
| **Cannot resolve hostname** | Hostname not configured    | Add hostname to `/etc/hosts` or use DNS                              |

## Development Tips

- **Hot Module Replacement (HMR)**: Changes auto-reload in the browser
- **Build Analysis**: Run `npm run build:analyze` to analyze bundle size
- **Production Build**: Run `npm run build` to create optimized production bundle in `dist/`
- **TypeScript**: While this is a JavaScript project, type checking is available via JSDoc comments
