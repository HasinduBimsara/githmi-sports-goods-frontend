Here is a modern, professional, and visually appealing `README.md` tailored for your **Githmi Sports Goods Frontend** project. You can copy and paste this directly into your GitHub repository.

---

# 🏅 Githmi Sports Goods - Frontend

A "Next-Level" modern e-commerce frontend built for **Githmi Sports Goods**. This application features a premium user interface with advanced glassmorphism, fluid animations, full dark-mode support, and seamless authentication.

## ✨ Key Features

* **Premium UI/UX:** Built with Tailwind CSS featuring glassmorphic overlays, custom scrollbars, and fluid layout transitions.
* **Smart Animations:** Includes custom `<ShinyText />` components, pulsing notification badges, and physical spring-like hover effects.
* **Full Dark Mode:** Deep integration of Dark/Light themes using a modern iOS-style pill toggle.
* **Authentication:** Secure user login and registration powered by Axios, featuring **Google OAuth** integration.
* **Responsive Design:** A flawless mobile experience with a highly blurred, sliding drawer menu.
* **Modern Iconography:** Utilizes the lightweight and aesthetic `react-icons/fi` (Feather Icons) for a clean, unified look.
* **Interactive Components:** Features interactive product sliders, floating live-chat widgets, and dynamic contact forms.

## 🛠️ Tech Stack

* **Framework:** React.js + Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **State/API:** Axios
* **Authentication:** `@react-oauth/google`
* **Icons:** `react-icons` (Feather, Bootstrap, Material)
* **Toasts/Alerts:** `react-hot-toast`

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed.

* Node.js (v16 or higher)
* npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/githmi-sports-goods-frontend.git
cd githmi-sports-goods-frontend

```


2. **Install dependencies**
```bash
npm install

```


3. **Set up Environment Variables**
Create a `.env` file in the root of your project and add the following variables:
```env
# Your backend API URL
VITE_BACKEND_URL=http://localhost:5000 

# Google OAuth Client ID (if applicable)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

```


4. **Run the development server**
```bash
npm run dev

```


Open [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) to view it in the browser.

## 📂 Folder Structure

```text
src/
├── assets/            # Static images and global graphics (e.g., login-bg.jpg)
├── components/        # Reusable UI components (Header, Loader, ShinyText, etc.)
├── pages/             # Page components
│   ├── client/        # Public facing pages (Home, Products, Contact, Reviews)
│   ├── LoginPage.jsx  
│   └── RegisterPage.jsx
├── App.jsx            # Main application router
├── index.css          # Global Tailwind styles & custom scrollbar CSS
└── main.jsx           # React DOM render entry point

```

## 🎨 UI Highlights

* **ShinyText Effect:** A custom reusable component (`ShinyText.jsx`) that adds a sweeping, high-contrast glare across headings and buttons to draw user attention.
* **Sticky Navigation:** A backdrop-blurred header that reacts to scroll events and shrinks dynamically.
* **Form Validation:** Client-side validation with instant visual feedback via `react-hot-toast`.

---

*Designed & Developed for the ultimate sports shopping experience.*

---
