import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from '@/components/auth/login';
import RegisterPage from '@/components/auth/register';
import UnauthorizedPage from '@/components/auth/UnauthorizedPage';
import NotFoundPage from '@/components/auth/NotFoundPage';

import RoleGuard from '@/components/shared/guards/RoleGuard';
import GuestGuard from '@/components/shared/guards/GuestGuard';

import AdminAppLayout from '@/components/admin/template/AppLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUserRoutes from '@/components/admin/module/user';
import AdminProfileRoutes from '@/components/admin/module/profile';

import CustomerAppLayout from '@/components/customer/template/AppLayout';
import CustomerDashboard from '@/components/customer/CustomerDashboard';
import CustomerProfileRoutes from '@/components/customer/module/profile';

import UserAppLayout from '@/components/user/template/AppLayout';
import UserDashboard from '@/components/user/UserDashboard';
import UserProfileRoutes from '@/components/user/module/profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />

      <Route
        path="/register"
        element={
          <GuestGuard>
            <RegisterPage />
          </GuestGuard>
        }
      />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={['admin']}>
            <AdminAppLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users/*" element={<AdminUserRoutes />} />
        <Route path="profile/*" element={<AdminProfileRoutes />} />
      </Route>

      <Route
        path="/customer"
        element={
          <RoleGuard allowedRoles={['customer']}>
            <CustomerAppLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="profile/*" element={<CustomerProfileRoutes />} />
      </Route>

      <Route
        path="/user"
        element={
          <RoleGuard allowedRoles={['user']}>
            <UserAppLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile/*" element={<UserProfileRoutes />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
