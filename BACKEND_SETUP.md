# Backend Setup

Use these steps to connect this frontend to `c:\Users\Hasindu Bimsara\Documents\GitHub\githmi-sports-goods-backend.zip`.

1. Extract `c:\Users\Hasindu Bimsara\Documents\GitHub\githmi-sports-goods-backend.zip` to a normal folder such as `c:\Users\Hasindu Bimsara\Documents\GitHub\githmi-sports-goods-backend`.
2. Open a terminal in that extracted backend folder.
3. Run `npm install`.
4. Open the backend `.env` file and confirm these values:
   `PORT=5000`
   `CLIENT_URL=http://localhost:5173/`
   `MONGO_URI=...`
   `JWT_SECRET=...`
5. Start the backend with `npm run dev`.
6. Check the backend health URL in your browser or terminal:
   `http://localhost:5000/health`
7. In this frontend project, confirm `.env` contains:
   `VITE_BACKEND_URL=http://localhost:5000`
8. Start the frontend with `npm run dev`.
9. Open `http://localhost:5173`.
10. Register or log in before trying protected backend features such as reviews and orders.

## Current API Alignment

- Products load from `GET /api/product`.
- Product details load from `GET /api/product/:productId`.
- Reviews load from `GET /api/reviews`.
- Review submission uses `POST /api/reviews` with `Authorization: Bearer <token>`.
- New reviews are user-submitted but stay pending until admin approval.
- Orders use `POST /api/order` with this payload shape:

```json
{
  "name": "Customer Name",
  "address": "Delivery address",
  "phoneNumber": "0771234567",
  "items": [
    {
      "productId": "product-id",
      "quantity": 1
    }
  ]
}
```

## If Something Fails

- If the frontend shows network errors, make sure the backend is actually running on port `5000`.
- If login works but reviews or orders fail, log in again so `localStorage.token` is fresh.
- If products do not load, check the backend database and confirm active products exist.
