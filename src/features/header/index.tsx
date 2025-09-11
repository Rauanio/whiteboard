import { ROUTES } from '@/shared/model/routes';
import { useSession } from '@/shared/model/session';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/kit/button';

export const Header = () => {
  const { session, logout } = useSession();

  return (
    <header className="bg-background shadow-sm py-3 px-4 outline-0">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">Miro Copy</div>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.email}</span>
            <Button variant="outline" size="default" onClick={() => logout()}>
              Выйти
            </Button>
          </div>
        ) : (
          <Button asChild variant="default" size="sm">
            <Link to={ROUTES.LOGIN}>Войти</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
