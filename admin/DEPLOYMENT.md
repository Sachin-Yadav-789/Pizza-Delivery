# Admin deployment

The admin app uses `http://localhost:4000` during local development. In a
production build, it uses the deployed API at
`https://pizza-delivery-backend-lnkk.onrender.com`.

To use a different backend, set `VITE_API_URL` to the backend's base URL in the
admin app's Render environment variables, then trigger a new deploy. Vite
includes this value at build time.
