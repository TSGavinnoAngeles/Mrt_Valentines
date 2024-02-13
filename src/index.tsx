import React from 'react';
import ReactDOM from 'react-dom/client';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './screens/context/AuthContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './screens/home';
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import Contact from "./screens/contact";
import Station from './station';
import Dashboard from './admin';
import StationAdmin from './admin/adminstat';
import UserEditor from './admin/userEditor';
import CardUpdateForm from './admin/userEditor/userBal';
import AdminLogin from '../src/screens/home/login'
import CardCreator from './admin/adminCreator'
import Drag from './Tests/drag';
import Arrow from './Tests/arrows';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider><AdminLogin /></AuthProvider>,
    errorElement: <ErrorPage />,
  },

  {
    path: "/test/DnD",
    element: <Drag />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/test/xg",
    element: <Arrow />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/station/get/:stationId/:methodId",
    element: <Station />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/admin-dashboard",
    element:   <AuthProvider><ProtectedRoute><Dashboard /></ProtectedRoute></AuthProvider>,
    errorElement: <ErrorPage />,
  },
  
  {
    path: "/admin-dashboard/station-management", 
    element: <AuthProvider><ProtectedRoute><StationAdmin /></ProtectedRoute></AuthProvider>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin-dashboard/UUID-Editor", 
    element: <AuthProvider><ProtectedRoute><UserEditor /></ProtectedRoute></AuthProvider>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin-dashboard/UUID-Editor/cardUpdate", 
    element: <AuthProvider><ProtectedRoute><CardUpdateForm /></ProtectedRoute></AuthProvider>,
    errorElement: <ErrorPage />,
  }, 
  {
    path: "/admin-dashboard/UUID-Editor/User-Creator",
    element: <AuthProvider><ProtectedRoute><CardCreator /></ProtectedRoute></AuthProvider>,
  }

 
]);



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <RouterProvider router = {router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
