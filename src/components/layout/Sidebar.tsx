import { NavLink, Link } from 'react-router-dom';
import { APP_ROUTES } from '@/app/router/constants';

const links = [
  { to: APP_ROUTES.dashboard, label: 'Dashboard' },
  { to: APP_ROUTES.tracking, label: 'Tracking' },
  { to: `${APP_ROUTES.dailyBase}/today`, label: 'Daily' },
];

export const Sidebar = () => (
  <aside className="flex flex-col w-60 border-r border-border bg-surface-elevated p-4 h-full">
    {/* Main Navigation Links */}
    <nav className="space-y-2 flex-grow">
      {links.map((link) => (
        <NavLink
          key={link.to}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm transition-colors ${
              isActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            }`
          }
          to={link.to}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>

    {/* Bottom Anchored Profile Link */}
    <div className="pt-4 mt-4 border-t border-border">
      <Link 
        to={APP_ROUTES.profile} 
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors"
      >
        <span>👤 Profile</span>
      </Link>
    </div>
  </aside>
);