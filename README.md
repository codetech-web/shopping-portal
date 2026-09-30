# ShopSphere — E-Commerce Shopping Portal

A creative, internship/final-year-style e-commerce shopping portal built with:

- React JS + Vite
- Python Django
- MySQL-ready architecture (but **NO database is required or used**)
- LocalStorage for cart, wishlist and recent activity
- Django JSON API with in-memory mock product/order data

## Features

### Customer side
- Modern responsive storefront UI
- Hero banner and promotional sections
- Product search with live filtering
- Category filters
- Price sorting
- Product detail modal/page
- Wishlist
- Shopping cart
- Quantity controls
- Coupon simulation
- Checkout form
- Order confirmation
- Recently viewed products
- Deals / flash-sale section
- Responsive mobile navigation
- Dark/light visual styling
- Toast notifications
- LocalStorage persistence

### Admin-style dashboard
- Product/order/customer/ revenue cards
- Recent orders table
- Category distribution
- Inventory indicators
- Mock analytics (no DB)

### Backend
Django exposes:
- `/api/health/`
- `/api/products/`
- `/api/categories/`
- `/api/products/<id>/`
- `/api/orders/`

No database migrations or MySQL setup are required for this demo.

## Folder structure

```text
ecommerce-shopping-portal/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── ecommerce_api/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── store/
│       ├── urls.py
│       └── views.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── data.js
│       └── styles.css
└── README.md
```

## Run in VS Code

### 1. Backend

Open a terminal:

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install:

```bash
pip install -r requirements.txt
```

Run:

```bash
python manage.py runserver
```

Backend:
`http://127.0.0.1:8000`

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:
`http://localhost:5173`

## Important

This project intentionally does NOT require MySQL or any database.

The Django backend uses in-memory sample data. The browser uses LocalStorage for:
- cart
- wishlist
- recently viewed products

If you later want a real production version, MySQL can be connected by replacing the mock repository with Django models.

## Demo flow

1. Search for a product.
2. Filter by category.
3. Open a product.
4. Add it to wishlist/cart.
5. Change quantities.
6. Apply `SHOP10` at checkout.
7. Submit the order.
8. View the generated order confirmation.

## Academic project modules

Suggested project title:

**ShopSphere: Smart E-Commerce Shopping Portal**

Possible viva modules:
1. User interface and responsive design
2. Product catalog
3. Search and filtering
4. Shopping cart
5. Wishlist
6. Checkout
7. Order processing
8. REST API
9. LocalStorage state management
10. Admin analytics dashboard
11. Inventory status
12. Coupon engine
13. Security and validation concepts
14. Future MySQL integration

## Future enhancements

- Django authentication
- MySQL database
- Razorpay/Stripe integration
- Real admin CRUD
- Product image upload
- JWT authentication
- Recommendation engine
- Email notifications
- Delivery tracking
- Reviews and ratings
- Redis caching
