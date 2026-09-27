# ShopSphere — Full-Stack E-Commerce Platform

ShopSphere is a full-stack e-commerce web application built to provide users with a modern and convenient online shopping experience.

## Features

* Product browsing and category filtering
* Product details
* Shopping cart and wishlist
* User authentication
* Order management
* Responsive user interface

## Tech Stack

**Frontend:** React, Vite, JavaScript
**Backend:** Python, Django, Django REST Framework
**Database:** SQLite

## Project Structure

* `frontend/` — React frontend
* `backend/` — Django REST API

## Getting Started

### Prerequisites

* Node.js and npm
* Python
* Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/shopsphere-ecommerce.git
cd shopsphere-ecommerce
```

### 2. Run the Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

### 3. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite in your browser.

## Environment Variables

Configure the required environment variables using the provided `.env.example` files.

Never commit passwords, secret keys, API credentials, or personal tokens.

## Project Status

Developed as a full-stack e-commerce project for learning and portfolio purposes.
