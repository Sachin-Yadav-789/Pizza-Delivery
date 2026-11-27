# SliceDash Admin Dashboard

The admin dashboard is a React application for managing the food catalog and customer orders in the Pizza Delivery project. It uses Vite, React Router, Axios, and React Toastify, and talks to the Express API in `backend/`.

## What the dashboard does

- Add a food item with a name, description, price, category, and uploaded image.
- View the food items currently returned by the backend and remove an item.
- View customer orders, including their delivery address, phone number, items, and amount.
- Change an order's status to `Food Process`, `out for delivery`, or `Delivered`.
- Show success and error messages using toast notifications.

The dashboard currently has no admin sign-in flow. Its add, remove, list, and order-management requests are sent without an authentication token. Do not expose this admin app and its write-enabled API publicly without putting appropriate access controls in place.

## Requirements

- Node.js and npm (use a Node.js release supported by the installed Vite version).
- The project's backend running and connected to its database for menu and order data.

## Run locally

Start the backend in one terminal:

```bash
cd backend
npm install
npm run server
```

In another terminal, start the admin app:

```bash
cd admin
npm install
npm run dev
```

Vite prints the local admin URL in the terminal (normally `http://localhost:5173`). The backend listens on port `4000` by default, unless `PORT` is set.

## Backend URL configuration

`src/App.jsx` selects the backend URL in this order:

1. `VITE_API_URL`, when provided.
2. `http://localhost:4000` during Vite development.
3. `https://pizza-delivery-backend-lnkk.onrender.com` for a production build.

To use a different backend, create `admin/.env.local` with the URL, for example:

```dotenv
VITE_API_URL=http://localhost:4000
```

Restart the Vite server after changing the environment file. Do not put credentials or other secrets in `VITE_*` variables; values with this prefix are included in the frontend bundle.

## Available scripts

Run these commands from `admin/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Preview the production build locally after building. |
| `npm run lint` | Run ESLint on the admin source. |

## Dashboard pages

| Route | Page | Behavior |
| --- | --- | --- |
| `/add` | Add Items | Submits food details and an image to the backend. Categories are the eight pizza categories shown in the form. |
| `/list` | List Items | Loads food items, displays a retry message if loading fails, and offers a remove action for each item. |
| `/orders` | Orders | Loads all orders and lets the operator update each order's status. |

## API requests made by this dashboard

All requests use the base URL described above. These admin requests currently do not include an authentication header.

| Method and path | Used for | Request data |
| --- | --- | --- |
| `POST /api/food/add` | Add a menu item with its image. | `multipart/form-data`: `name`, `description`, `price`, `category`, and `image`. |
| `GET /api/food/list` | Load menu items for the list page. | None |
| `POST /api/food/remove` | Remove a menu item. | JSON body containing `id`. |
| `GET /api/order/list` | Load orders for the orders page. | None |
| `POST /api/order/status` | Update an order's status. | JSON body containing `orderId` and `status`. |

Food images are displayed from `${VITE_API_URL}/images/${image}`. The backend must make its uploaded image files available through `/images`.

## Project layout

```text
admin/
├── public/                 # Public assets served directly by Vite
├── screenShots/            # Screenshots used in this README
├── src/
│   ├── assets/             # Dashboard icons and images
│   ├── components/
│   │   ├── Navbar/         # Dashboard header
│   │   └── Sidebar/        # Navigation links
│   ├── pages/
│   │   ├── Add/            # Food-item upload form
│   │   ├── List/           # Food catalog and remove action
│   │   └── Orders/         # Order list and status updates
│   ├── App.jsx             # API URL, routes, and toast container
│   ├── App.css
│   ├── index.css
│   └── main.jsx            # React entry point and router
├── index.html
├── package.json
└── vite.config.js
```

## Screenshot

![Admin dashboard](./screenShots/admin.png)

## Troubleshooting

- **Food list is empty or unavailable:** check that the backend and database are running and that the configured API URL is correct. The list page includes a retry action.
- **Images do not display:** confirm that the image filename exists on the backend and is served from `/images`.
- **Add or remove fails:** check the browser console and network panel for the API response. The backend must accept the request and be able to write to its uploads directory and database.
- **Order list or status updates fail:** verify the backend's order endpoints and database connection.
- **Vite keeps using the previous API URL:** restart the dev server after editing `admin/.env.local`.
