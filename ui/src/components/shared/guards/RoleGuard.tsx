import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '@/types';
import { getAuthUser, isLoggedIn } from '@/api/auth/auth';

interface Props {
  allowedRoles: Role[];
  children: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: Props) {
  const location = useLocation();
  const user = getAuthUser();

  if (!isLoggedIn() || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
