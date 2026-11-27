# SliceDash Customer Frontend

The customer-facing React application for browsing the pizza menu, managing a cart, checking out, paying through Razorpay, and viewing orders. It is built with React, Vite, React Router, and Axios, and uses the project's Express backend for menu, account, cart, and order data.

## What the app currently does

- Loads food items from the backend and filters them by the menu categories defined in `src/assets/assets.js`.
- Adds items to and removes items from the cart. Signed-in users sync cart changes with the backend; the frontend also keeps cart state in its shared React context.
- Registers and signs in customers through the backend. The returned token is stored in browser `localStorage` and sent with authenticated requests in a `token` request header.
- Collects delivery details and starts a Razorpay payment-link checkout.
- Sends Razorpay's callback parameters to the backend for verification, then opens the customer's order history.
- Displays the current status for each order returned by the backend.

The cart page displays a ₹30 delivery fee for a non-empty cart. A promo-code field is visible, but discount codes are not implemented in the current frontend.

## Requirements

- Node.js and npm (use a Node.js release supported by the installed Vite version).
- The project's backend running and connected to its database for menu, account, cart, and order features.
- Valid backend JWT and Razorpay configuration to use sign-in and payment flows.

## Run locally

From this directory (`frontend/`):

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal (normally `http://localhost:5173`). Start the backend separately from `backend/`:

```bash
npm install
npm run server
```

The backend listens on port `4000` by default, unless `PORT` is set. Its database and payment-provider configuration must also be set up for the corresponding features to work.

## Available scripts

Run these commands from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview the production build locally after building. |
| `npm run lint` | Run ESLint on the frontend source. |

## Routes and customer flow

| Route | Page |
| --- | --- |
| `/` | Home page: header, category selector, food list, and app-download section. |
| `/cart` | Cart contents, subtotal, delivery fee, and checkout link. |
| `/order` | Delivery information and payment initiation. Requires a signed-in user and a non-empty cart; otherwise the page redirects to `/cart`. |
| `/verify` | Receives Razorpay callback query parameters and asks the backend to verify payment. |
| `/myorders` | Lists the signed-in customer's orders and their current status. |

Typical purchase flow: choose a category on the home page, add pizzas to the cart, sign in or register, proceed to checkout, submit delivery details, complete payment on Razorpay, and return to the order history after successful verification.

## Backend connection

The API base URL is currently hard-coded as `https://pizza-delivery-backend-lnkk.onrender.com` in `src/context/StoreContext.jsx`. This frontend does not currently read the API URL from a Vite environment variable.

To use a local backend, change the `url` value in `src/context/StoreContext.jsx` to:

```js
const url = "http://localhost:4000";
```

The backend serves uploaded food images from `/images`, so the frontend builds image URLs using the API base URL plus `/images/` and the image filename returned with each food item.

### API requests made by this frontend

| Method and path | Used for | Authentication |
| --- | --- | --- |
| `GET /api/food/list` | Load the food menu. | No |
| `POST /api/user/register` | Create a customer account. | No |
| `POST /api/user/login` | Sign in a customer. | No |
| `POST /api/cart/add` | Add one item to a signed-in customer's cart. | `token` request header |
| `POST /api/cart/remove` | Remove one quantity of an item. | `token` request header |
| `POST /api/cart/get` | Load a signed-in customer's cart. | `token` request header |
| `POST /api/order/place` | Create an order and request a Razorpay payment link. | `token` request header |
| `POST /api/order/verify` | Verify Razorpay callback data. | No; verification is performed by the backend |
| `POST /api/order/userorders` | Load the signed-in customer's order history. | `token` request header |

For requests that change or load a user's cart, the frontend sends the item identifier as `itemId` in the request body. Order placement sends the delivery address, cart items, and total amount.

## Project layout

```text
frontend/
├── public/                 # Public assets served directly by Vite
├── screenShots/            # Screenshots used in this README
├── src/
│   ├── assets/             # UI icons, menu images, and food illustrations
│   ├── components/         # Navbar, login popup, menu, food cards, and footer
│   ├── context/
│   │   └── StoreContext.jsx  # Shared menu, cart, API URL, and auth token state
│   ├── pages/              # Home, cart, checkout, payment verification, orders
│   ├── app.jsx             # Routes and shared page layout
│   ├── index.css           # Global styles
│   └── main.jsx            # React entry point and providers
├── index.html
├── package.json
└── vite.config.js
```

## Screenshots

![Home page](./screenShots/home.png)

![Cart page](./screenShots/cart.png)

## Troubleshooting

- **Menu is empty or requests fail:** confirm the backend is running, then check the API URL in `src/context/StoreContext.jsx` and the browser console/network panel.
- **Food images do not load:** confirm the backend's `/images` route is serving the filenames returned by `/api/food/list`.
- **Cart or order history does not load:** sign in again and confirm the backend is reachable; these requests require the stored `token`.
- **Checkout does not open:** checkout requires a signed-in user and at least one cart item. Payment-link creation also depends on the backend's Razorpay configuration.
- **Payment returns an error:** the Razorpay callback must reach `/verify`, and the backend must be configured to validate the callback and redirect to the frontend.
