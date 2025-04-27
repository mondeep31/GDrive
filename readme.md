

Note: There are some issues with deployment in free tier of Render, It is explained [here](https://jet-clock-de6.notion.site/Problems-with-free-tier-deployment-1e2333ba479180bd8c90d485e27172a4) for better understanding

[Demo]()
---

#  Google Drive Clone

This is a full-stack application that allows users to **sign in with Google**, **upload, manage, search, download, and share files**, similar to Google Drive.  
Built using **React.js + Node.js (TypeScript)**, with **AWS S3** for storage and **MongoDB** for database.

---

## ⚙️ Technology Stack

- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: Google OAuth 2.0
- **File Storage**: AWS S3
- **Containerization**: Docker & Docker Compose

---

## 🛠️ Local Development Setup

### Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Install [Node.js](https://nodejs.org/)
---

### 1. Clone the repository

```bash
git clone https://github.com/mondeep31/GDrive.git
cd twospoon
```

---

### 2. Backend Setup (Dockerized)

#### a. Navigate to the backend folder:

```bash
cd server
```

#### b. Create a `.env` file inside `/server`

Use `.env.sample` as a reference:

```bash
cp .env.sample .env
```

Fill in all necessary environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
SESSION_SECRET=your_secret_session_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/auth/google/callback
FRONTEND_URL=http://localhost:5173
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_s3_bucket_name
```

---

#### c. Start backend server

```bash
docker compose up --build
```

- Backend will start at `http://localhost:5000`

---

### 3. Frontend Setup (Vite + React)

#### a. Navigate to frontend folder:

```bash
cd ../client
```

#### b. Install dependencies:

```bash
npm install
```
#### b. Create a `.env` file inside `/client`

Use `.env.sample` as a reference:

```bash
cp .env.sample .env
```

Fill in all necessary environment variables:

```env
VITE_AXIOS_BASE_URL=http://localhost:5000
```

#### c. Run frontend locally:

```bash
npm run dev
```

- Frontend will start at `http://localhost:5173`

---

### 4. Test the Application

- Visit: [http://localhost:5173](http://localhost:5173)
- Login with your Google account
- Start uploading files!

---

## 🚀 Deployment Instructions

> **This app can be deployed to Render, Vercel, AWS EC2, or any other cloud provider.**

---

### Backend Deployment (Server)

1. **Deploy backend** on your server/cloud instance.
2. **Setup Environment Variables** on the server:
   - Same as your local `.env`
   - But update:
     - `CALLBACK_URL=https://yourbackenddomain.com/auth/google/callback`
     - `FRONTEND_URL=https://yourfrontenddomain.com`
3. **Expose the port** (5000 or use reverse proxy like Nginx).
4. **Remember** to set `app.set('trust proxy', 1);` for session cookies.

---

### Frontend Deployment (Client)

1. **Update frontend `.env`**:

```env
VITE_AXIOS_BASE_URL=https://yourbackenddomain.com
```

2. **Build frontend**:

```bash
npm run build
```

3. **Deploy frontend** to [Vercel](https://vercel.com/) (recommended) or any static hosting.

---

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select existing.
3. Setup OAuth consent screen:
   - Application name
   - Support email
   - Authorized domains (example: `yourfrontenddomain.com`)
4. Setup OAuth credentials:
   - Authorized Redirect URIs:
     - `https://yourbackenddomain.com/auth/google/callback`
5. Save the `CLIENT_ID` and `CLIENT_SECRET` and use them in `.env`.

---

### MongoDB Atlas Setup

- Create a free MongoDB cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a new database and user.
- Whitelist your server's IP.
- Get the connection URI and set it in `MONGODB_URI` in backend `.env`.

---

### AWS S3 Setup

- Create an S3 bucket on [AWS S3](https://aws.amazon.com/s3/).
- Create IAM User with S3 full access.
- Save the:
  - AWS Access Key
  - AWS Secret Key
- Set Bucket name, Region, and keys into `.env`.

---

## 🔥 Final Environment Variables Summary

| Key                    | Description                                  |
|-------------------------|----------------------------------------------|
| `PORT`                  | Backend running port                        |
| `MONGODB_URI`           | MongoDB connection string                   |
| `SESSION_SECRET`        | Session encryption secret key               |
| `GOOGLE_CLIENT_ID`      | Google OAuth Client ID                      |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth Client Secret                  |
| `CALLBACK_URL`          | Google OAuth redirect URL                   |
| `FRONTEND_URL`          | Your deployed frontend URL                  |
| `AWS_ACCESS_KEY_ID`     | AWS IAM Access Key                          |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Key                          |
| `AWS_REGION`            | AWS region for your S3 bucket               |
| `S3_BUCKET_NAME`        | Your S3 bucket name                         |

---

# ✅ Final Tip

- Make sure `secure: true` and `sameSite: none` is used for session cookies in production and `sameSite: lax` in development.
- Always deploy backend and frontend **on HTTPS** domains in production.
- Set correct CORS allowed origins in your backend!

---

# 📸 Screenshots

[Screenshots]()

---

# 👨‍💻 Author

Made with ❤️ by [Mondeep](https://github.com/mondeep31)

---


