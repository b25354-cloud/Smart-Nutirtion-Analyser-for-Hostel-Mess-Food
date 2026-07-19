import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/router/constants';
import { Card } from '@/components/common';

const features = [
  {
    title: 'Mess-first Tracking',
    description: 'Select your meals directly from the hostel menu with no manual ingredient entry needed.',
  },
  {
    title: 'Nutrition Insights',
    description: 'Get clean daily overviews of your calorie and nutrient intake to maintain a balanced diet.',
  },
  {
    title: 'Personalized AI Coach',
    description: 'Receive customized dietary suggestions tailored to your campus lifestyle and goals.',
  },
] as const;

export const LandingPage = () => (
  <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 py-8 sm:py-16 px-4">
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
          Smart Nutrition Analyzer for Hostel Food
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Understand your diet quality directly from real mess meals.
        </h1>
        <p className="max-w-2xl text-lg text-text-secondary">
          Track what you eat at the hostel mess, discover your nutritional gaps, and make healthier choices without the hassle of manual calorie counting.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={ROUTES.auth}
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:opacity-90"
          >
            Login / Sign Up
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