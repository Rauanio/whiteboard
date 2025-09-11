import { publicRqClient } from '@/shared/api/instance';
import type { ApiSchemas } from '@/shared/api/schema';
import { ROUTES } from '@/shared/model/routes';
import { useSession } from '@/shared/model/session';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const navigate = useNavigate();
  const { setSessionToken } = useSession();

  const registerMutation = publicRqClient.useMutation('post', '/auth/register', {
    onSuccess(data) {
      setSessionToken(data.accessToken);
      navigate(ROUTES.HOME);
    },
  });

  const register = (data: ApiSchemas['RegisterRequest']) => {
    registerMutation.mutate({ body: data });
  };

  const errorMessage = registerMutation.isError
    ? registerMutation.error.message
    : undefined;

  return {
    register,
    isPending: registerMutation.isPending,
    errorMessage,
  };
};
