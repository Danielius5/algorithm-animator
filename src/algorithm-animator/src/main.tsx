import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import DFAFromRegex from './pages/dfa-from-regex.tsx';
import DFAFromUI from './pages/dfa-from-ui.tsx';
import Home from './pages/home.tsx';


const router = createHashRouter([
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
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
