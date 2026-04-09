import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { UtensilsCrossed, Zap, Globe, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: UtensilsCrossed,
      title: 'Meal Management',
      description: 'Create and manage your meal catalog with full macro tracking.',
    },
    {
      icon: Zap,
      title: 'Subscriptions',
      description: 'Offer recurring meal plans with automated billing cycles.',
    },
    {
      icon: Globe,
      title: 'White-Label Website',
      description: 'Get your own branded storefront with custom themes and colors.',
    },
    {
      icon: BarChart3,
      title: 'Order Dashboard',
      description: 'Track and manage all orders with real-time status updates.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Prepify</h1>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Launch Your <span className="text-primary">Meal Prep</span> Business
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The all-in-one platform to manage meals, orders, subscriptions, and your own branded storefront.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-base px-8">Start Free</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="text-base px-8">Learn More</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="text-center">
                <CardContent className="pt-8 pb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg opacity-90 mb-8">
            Create your meal prep business in minutes. No credit card required.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Create Your Business
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Prepify. Built for meal prep entrepreneurs.</p>
      </footer>
    </div>
  );
}
