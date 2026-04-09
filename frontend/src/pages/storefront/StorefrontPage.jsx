import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { businessAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

export default function StorefrontPage() {
  const { subdomain } = useParams();
  const [business, setBusiness] = useState(null);
  const [config, setConfig] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStorefront = async () => {
      try {
        const bizRes = await businessAPI.getBySubdomain(subdomain);
        const biz = bizRes.data.data;
        setBusiness(biz);

        const [configRes, mealsRes] = await Promise.all([
          businessAPI.getWebsiteConfig(biz._id),
          businessAPI.getPublicMeals(biz._id),
        ]);
        setConfig(configRes.data.data);
        setMeals(mealsRes.data.data || []);
      } catch {
        setError('Business not found');
      } finally {
        setLoading(false);
      }
    };
    fetchStorefront();
  }, [subdomain]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    </div>
  );

  const colors = config?.colors || {};

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Header */}
      <header className="border-b" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config?.logo && <img src={config.logo} alt={business?.name} className="h-10 w-10 rounded-full object-cover" />}
            <h1 className="text-2xl font-bold text-white">{business?.name}</h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: colors.primary + '10' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{config?.heroText || 'Fresh Meals, Delivered.'}</h2>
          {config?.aboutText && <p className="text-lg text-muted-foreground">{config.aboutText}</p>}
        </div>
      </section>

      {/* Banners */}
      {config?.banners?.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.banners.map((banner, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden border">
                {banner.imageUrl && <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover" />}
                <div className="p-4">
                  {banner.title && <h3 className="font-semibold">{banner.title}</h3>}
                  {banner.subtitle && <p className="text-sm text-muted-foreground">{banner.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Meals Menu */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Menu</h2>
        {meals.length === 0 ? (
          <p className="text-center text-muted-foreground">Menu coming soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <Card key={meal._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <span className="text-xl font-bold" style={{ color: colors.primary }}>
                      ${meal.price.toFixed(2)}
                    </span>
                  </div>
                  {meal.category && <Badge variant="secondary">{meal.category}</Badge>}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 text-xs text-muted-foreground mb-4">
                    <span>Protein: {meal.macros?.protein || 0}g</span>
                    <span>Carbs: {meal.macros?.carbs || 0}g</span>
                    <span>Fats: {meal.macros?.fats || 0}g</span>
                    <span>{meal.macros?.calories || 0} cal</span>
                  </div>
                  <Button className="w-full" style={{ backgroundColor: colors.primary }}>
                    Add to Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {business?.name}. Powered by Prepify.</p>
      </footer>
    </div>
  );
}
