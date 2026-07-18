import { NavLink } from 'react-router-dom';

import { APP_ROUTES } from '@/app/router/constants';

const links = [
  { to: APP_ROUTES.dashboard, label: 'Dashboard' },
  { to: APP_ROUTES.tracking, label: 'Tracking' },
  { to: `${APP_ROUTES.dailyBase}/today`, label: 'Daily' },
  { to: APP_ROUTES.weekly, label: 'Weekly' },
  { to: APP_ROUTES.coach, label: 'AI Coach' },
];

export const Sidebar = () => (
  <aside className="w-60 border-r border-border bg-surface-elevated p-4">
    <nav className="space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          to={link.to}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
