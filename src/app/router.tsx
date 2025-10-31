import { ROUTES } from '../shared/model/routes';
import { createBrowserRouter, Outlet, redirect } from 'react-router-dom';
import { App } from './App';
import { protectedLoader, ProtectedRoute } from './protected-route';
import { Header } from '@/features/header';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        loader: protectedLoader,
        element: <ProtectedRoute />,
        children: [
          // маршруты с Header
          {
            element: (
              <>
                <Header />
                <Outlet />
              </>
            ),
            children: [
              {
                path: ROUTES.BOARDS,
                lazy: () => import('@/features/boards-list/boards-list.page'),
              },
              {
                path: ROUTES.FAVORITE_BOARDS,
                lazy: () => import('@/features/boards-list/boards-list-favorite.page'),
              },
              {
                path: ROUTES.RECENT_BOARDS,
                lazy: () => import('@/features/boards-list/boards-list-recent.page'),
              },
            ],
          },
          // маршрут без Header
          {
            path: ROUTES.BOARD,
            lazy: () => import('@/features/board/board.page'),
          },
        ],
      },
      {
        path: ROUTES.LOGIN,
        lazy: () => import('@/features/auth/login.page'),
      },
      {
        path: ROUTES.REGISTER,
        lazy: () => import('@/features/auth/register.page'),
      },
      {
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.BOARDS),
      },
    ],
  },
]);
