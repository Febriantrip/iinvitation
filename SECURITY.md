# Security

This repository must not contain production secrets or customer data.

Keep the following out of Git history:

- `server/.env`
- database exports
- customer guest lists
- customer media uploads
- invitation/review/session tokens from production
- real bank-account details
- real WhatsApp/contact data
- private keys and API credentials

If a credential is committed accidentally, rotate/revoke it first, then remove it from Git history.
