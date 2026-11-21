import React from 'react'
import ReactDOM from  'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import App from './app.jsx'
import StoreContextProvider from './context/StoreContext'

ReactDOM.createRoot(document.getElementById('root')).render(

    //here we set react router
 <BrowserRouter>
     {/* BrowserRouter connect your React application to the browser's address bar.  */}
     <StoreContextProvider>
          <App />
     </StoreContextProvider>
  
 </BrowserRouter>
)