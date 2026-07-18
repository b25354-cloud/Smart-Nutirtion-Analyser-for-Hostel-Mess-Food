import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { APP_ROUTES, ROUTES } from '@/app/router/constants';
import { Card } from '@/components/common';

const features = [
  {
    title: 'Mess-first Tracking',
    description: 'Select meals directly from hostel menu plans with no manual ingredient entry.',
  },
  {
    title: 'Nutrition Insights',
    description: 'Get clean daily overviews with score placeholders ready for future analytics.',
  },
  {
    title: 'Multi-college Ready',
    description: 'Architecture supports college-scoped data, users, menus, and insights from day one.',
  },
] as const;

export const LandingPage = () => (
  <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 py-8 sm:py-16">
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface-elevated p-8 shadow-sm sm:p-12"
    >
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
      <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-success/20 blur-3xl" />
      <div className="relative space-y-6">
        <p className="inline-flex rounded-full bg-surface-muted px-4 py-1 text-sm text-text-secondary">
          Smart Nutrition Analyzer for Hostel &amp; Mess Food
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          MessMate AI helps students understand diet quality from real mess meals.
        </h1>
        <p className="max-w-2xl text-lg text-text-secondary">
          Production-ready UI shell and routing are wired. Nutrition logic, scoring engines, and AI reasoning remain
          typed stubs by design.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={APP_ROUTES.dashboard}
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:opacity-90"
          >
            Enter App Shell
          </Link>
          <Link
            to={ROUTES.auth}
            className="rounded-lg border border-border bg-surface px-5 py-2.5 font-medium text-text-primary transition hover:bg-surface-muted"
          >
            Auth Flow Stub
          </Link>
        </div>
      </div>
    </motion.header>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {features.map((feature) => (
        <Card key={feature.title}>
          <h2 className="text-lg font-semibold">{feature.title}</h2>
          <p className="mt-2 text-sm text-text-secondary">{feature.description}</p>
        </Card>
      ))}
    </motion.div>
  </section>
);
