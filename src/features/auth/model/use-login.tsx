import { publicRqClient } from '@/shared/api/instance';
import type { ApiSchemas } from '@/shared/api/schema';
import { ROUTES } from '@/shared/model/routes';
import { useSession } from '@/shared/model/session';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();
  const { setSessionToken } = useSession();

  const loginMutation = publicRqClient.useMutation('post', '/auth/login', {
    onSuccess(data) {
      setSessionToken(data.accessToken);
      navigate(ROUTES.HOME);
    },
  });

  const login = (data: ApiSchemas['LoginRequest']) => {
    loginMutation.mutate({ body: data });
  };

  const errorMessage = loginMutation.isError ? loginMutation.error.message : undefined;

  return {
    login,
    isPending: loginMutation.isPending,
    errorMessage,
  };
};
