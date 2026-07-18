import type { ReactNode } from 'react';

import { Card } from '@/components/common';

interface RouteStubPageProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const RouteStubPage = ({ title, description, children }: RouteStubPageProps) => (
  <section className="space-y-4">
    <h1 className="text-2xl font-semibold">{title}</h1>
    <Card>
      <p className="text-text-secondary">{description ?? 'Architecture scaffold route placeholder.'}</p>
      {children}
    </Card>
  </section>
);
