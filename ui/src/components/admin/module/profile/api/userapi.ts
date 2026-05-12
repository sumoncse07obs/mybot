import type { AuthUser } from '../../../../../types';
import { apiRequest } from '../../../../../api/context/apiClient';

export function getProfile() {
  return apiRequest<AuthUser>('/auth/me');
}
