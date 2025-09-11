import { enableMocking } from '@/shared/api/mocks';
import { ROUTES } from '@/shared/model/routes';
import { useSession } from '@/shared/model/session';
import { Navigate, Outlet, redirect } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { session } = useSession();

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
};

export const protectedLoader = async () => {
  await enableMocking();

  const token = await useSession.getState().refreshToken();

  if (!token) {
    return redirect(ROUTES.LOGIN);
  }

  return null;
};
