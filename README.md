# Secure Payment Gateway Integration

A PCI-compliant payment page implementation using PCI Proxy's Secure Fields and RudderStack for analytics tracking.

## Features

- 🛡️ PCI DSS compliant card processing
- 🔒 Secure iframe fields for card data (PCI Proxy)
- 📊 Frontend analytics tracking (RudderStack)
- ⏳ Expiration date formatting
- ✅ Real-time validation
- 📈 Event tracking for payment attempts

## Technologies

- **Vanilla JavaScript**
- **Vite.js** (Build Tool)
- **PCI Proxy Secure Fields** (v2.x)
- **RudderStack Analytics SDK**
- **CSS3** (Custom Styling)

## Installation

1.  **Clone the repository**
    Replace `your-username` with your actual GitHub username or organization name.
    ```bash
    git clone [https://github.com/islam-mohammed/payment-form](https://github.com/islam-mohammed/payment-form)
    cd secure-payment-gateway
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    See the Configuration section below.

## Configuration

1.  **Create a `.env` file** in the root directory of the project.
2.  **Add your credentials** to the `.env` file like this:

    ```dotenv
    # PCI Proxy Configuration
    VITE_PCI_MERCHANT_ID=your_merchant_id

    # RudderStack Configuration
    VITE_RUDDERSTACK_WRITE_KEY=your_write_key
    VITE_RUDDERSTACK_DATA_PLANE_URL=[https://your.dataplane.url](https://your.dataplane.url)
    ```
    *Replace `your_merchant_id`, `your_write_key`, and `https://your.dataplane.url` with your actual credentials.*

### PCI Proxy Setup

- Get sandbox/production credentials from the PCI Proxy Dashboard.
- Whitelist your development and production domains in the PCI Proxy Dashboard.
- Configure allowed card types if necessary.

### RudderStack Setup

- Create a JavaScript Source in your RudderStack Dashboard.
- Note the Write Key and Data Plane URL.

## Usage

Run the development server:

```bash
npm run dev