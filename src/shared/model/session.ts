import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { publicFetchClient } from '../api/instance';

const TOKEN_KEY = 'token';

type Session = {
  userId: string;
  email: string;
  exp: number;
  iat: number;
};

interface SessionState {
  token: string | null;
  session: Session | null;
  setSessionToken: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
}

let refreshTokenPromise: Promise<string | null> | null = null;

export const useSession = create<SessionState>()((set) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const session = token ? jwtDecode<Session>(token) : null;

  const setSessionToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const session = jwtDecode<Session>(token);
    set({ token, session });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, session: null });
  };

  const refreshToken = async () => {
    if (!token) {
      return null;
    }

    const session = jwtDecode<Session>(token);

    if (session.exp < Date.now() / 1000) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = publicFetchClient
          .POST('/auth/refresh')
          .then((r) => r.data?.accessToken ?? null)
          .then((newToken) => {
            if (newToken) {
              setSessionToken(newToken);
              return newToken;
            } else {
              logout();
              return null;
            }
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      const newToken = await refreshTokenPromise;

      if (newToken) {
        return newToken;
      } else {
        return null;
      }
    }

    return token;
  };

  return {
    refreshToken,
    session,
    token,
    setSessionToken,
    logout,
  };
});
