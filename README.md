
# UPI PG - Free UPI Payment Link & QR Code Generator

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Full%20Suite-orange?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

**The simplest way to generate free, shareable UPI payment links and QR codes. Built for India.**

UPI PG is a modern, open, and fast platform for creating UPI payment requests. It serves everyone from individuals and freelancers to small businesses, offering a seamless experience for both anonymous one-time use and for registered users who need to track and manage their payment history.

![UPI PG Screenshot](https://raw.githubusercontent.com/CIT-U/UPI-PG/main/public/og-image.png)

---

## ✨ Key Features

- **Instant Link Generation**: Create payment links and QR codes on the fly without needing an account.
- **Customizable Payments**: Specify the amount, add notes, and even set an expiry date for your payment requests.
- **Sharable Payment Pages**: Every link generates a clean, professional payment page with a QR code and a "Pay with UPI" button for a seamless mobile experience.
- **QR Codes with Amount**: Generate QR codes with the payment amount pre-filled, so payers just need to scan and approve.
- **User Dashboard**: Sign up for a free account to view your payment history, manage link statuses (pending, completed, failed), and re-share links.
- **Secure & Private**: Leverages the security of the UPI network and Firebase for data storage. Anonymous links are public but not listable, and user data is protected by Firestore Security Rules.
- **Embeddable Widget**: A lightweight `<iframe>` widget that any website owner can drop into their site to start accepting UPI payments.
- **Multi-Language Support**: Fully internationalized with `next-intl`, supporting 12+ Indian languages to reach a wider audience.

---

## 🚀 Getting Started

The platform is designed to be intuitive.

1.  **For Anonymous Users**: Simply visit the homepage, fill in the payee name, UPI ID, amount, and optional notes/expiry. Click "Generate" and share the resulting page link or QR code.
2.  **For Registered Users**: Sign up with Google or email/password. You'll be taken to your dashboard where you can create links and view your entire payment history in real-time.

---

## 🛠️ Tech Stack & Architecture

This project is built with a modern, robust, and scalable tech stack.

| Category      | Technology                                    | Purpose                                                     |
|---------------|-----------------------------------------------|-------------------------------------------------------------|
| **Framework**   | [Next.js](https://nextjs.org/) (App Router)   | SSR, SSG, routing, and a full-stack React framework.          |
| **Styling**     | [Tailwind CSS](https://tailwindcss.com/)      | Utility-first CSS for rapid UI development.                 |
| **UI**          | [ShadCN UI](https://ui.shadcn.com/)           | Accessible, and composable UI components.                   |
| **Backend**     | [Firebase](https://firebase.google.com/)      | User authentication and database services.                  |
| **Database**    | [Firestore](https://firebase.google.com/docs/firestore) | NoSQL database for storing payment requests and user data.    |
| **Auth**        | [Firebase Auth](https://firebase.google.com/docs/auth) | Secure user sign-up/sign-in with email and Google.          |
| **i18n**        | [next-intl](https://next-intl-docs.vercel.app/) | Internationalization for multi-language support.            |
| **Language**    | [TypeScript](https://www.typescriptlang.org/) | Type safety for robust and maintainable code.               |
| **Form Mngmt**  | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | Efficient form handling and schema validation.              |

---

## 👨‍💻 For Developers: Integrations

UPI PG is designed to be easily integrated into other websites and applications.

### Embeddable Widget

Add a full-featured UPI payment form to your website with a simple copy-paste.

```html
<iframe
  src="https://upipg.cit.org.in/embed"
  width="100%"
  height="600px"
  frameborder="0"
  title="UPI Payment Generator"
></iframe>
```
This widget generates a public payment link that opens in a new tab.

### Manual UPI Deep Link & QR Code

For custom integrations, you can construct `upi://` URIs yourself and embed them in buttons or dynamic QR codes.

**UPI Link Format:**
`upi://pay?pa={UPI_ID}&pn={PAYEE_NAME}&am={AMOUNT}&cu=INR&tn={NOTES}`

**Example Link:**
`upi://pay?pa=your-id@bank&pn=Your%20Name&am=100.00&cu=INR&tn=Payment%20for%20Goods`

**Dynamic QR Code Generation:**
Use any QR code API to generate an image from the URL-encoded UPI link. We use `qrserver.com`:
```
https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ENCODED_UPI_LINK_HERE
```
For more details, visit the `/developers` page on the site.

---

## 🌍 Internationalization (i18n)

The platform is fully translated to support a diverse audience across India. This is managed using `next-intl` with locale-based routing (e.g., `/en`, `/hi`, `/ta-IN`).

**Supported Languages:**
- English (`en`)
- Hindi (`hi`)
- Bengali (`bn-IN`)
- Marathi (`mr-IN`)
- Telugu (`te-IN`)
- Tamil (`ta-IN`)
- Gujarati (`gu-IN`)
- Urdu (`ur-IN`)
- Kannada (`kn-IN`)
- Odia (`or-IN`)
- Malayalam (`ml-IN`)
- Punjabi (`pa-IN`)

A language switcher is available in the header for easy selection.

---

## 📜 License

This project is open-source and available under the MIT License.
