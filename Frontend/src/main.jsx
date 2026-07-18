import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './styles/index.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import PasswordReset from './pages/PasswordReset.jsx';
import Account from './pages/Account.jsx';
import TranslationHistory from './pages/TranslationHistory.jsx';
import HomeLayout from './layouts/HomeLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomeLayout/>}>
        <Route index element={<Home/>}/>

        <Route element={<AuthLayout/>}>
          <Route path="login" element={<Login/>}/>
          <Route path="sign-up" element={<SignUp/>}/>
          <Route path="forgot-password">
            <Route index element={<ForgotPassword/>}/>
            <Route path=":passwordResetToken" element={<PasswordReset/>}/>
          </Route>
        </Route>

        <Route path="account">
          <Route
            index
            element={
              <ProtectedRoute>
                <Account/>
              </ProtectedRoute>
            }
          />
          <Route
            path="translation-history"
            element={
            <ProtectedRoute>
              <TranslationHistory/>
            </ProtectedRoute>
          }
          />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>,
)
