import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
     <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    pauseOnHover
    draggable
    theme="colored"
  />
  </StrictMode>,
)
