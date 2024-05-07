import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import Customerlist from './components/Customerlist.jsx';
import Traininglist from './components/Traininglist.jsx';
import Home from './components/Home.jsx';

const router = createBrowserRouter([  
  {
    path: "/",
    element: <App />,
    children: [                      
      {
        element: <Home />,
        index: true                  
      },
      {
        path: "Customerlist",                
        element: <Customerlist />,
      },
      {
        path: "Traininglist",
        element: <Traininglist />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
