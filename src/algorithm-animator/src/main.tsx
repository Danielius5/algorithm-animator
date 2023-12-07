import React from 'react'
import ReactDOM from 'react-dom/client'
import DFAFromRegex from './pages/dfa-from-regex.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/home.tsx';
import DFAFromUI from './pages/dfa-from-ui.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element:<Home />,
  },
  {
    path: "/dfa-from-regex",
    element:<DFAFromRegex />,
  },
  {
    path: "/dfa-from-ui",
    element:<DFAFromUI />,
  },
], {basename: "/algorithm-animator"});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
