import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants';

export const NotFoundPage = () => (
  <div className="mx-auto max-w-xl py-20 text-center">
    <h1 className="text-3xl font-semibold">404</h1>
    <p className="mt-2 text-text-secondary">The page you requested was not found.</p>
    <Link className="mt-6 inline-block text-primary" to={ROUTES.home}>
      Go back home
    </Link>
  </div>
);
