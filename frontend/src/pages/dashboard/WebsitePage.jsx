import { useEffect, useState } from 'react';
import { businessAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import toast from 'react-hot-toast';

export default function WebsitePage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const businessRes = await businessAPI.get();
        const business = businessRes.data.data;
        const configRes = await businessAPI.getWebsiteConfig(business._id);
        setConfig(configRes.data.data);
      } catch {
        toast.error('Failed to load website config');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await businessAPI.updateWebsiteConfig(config);
      setConfig(res.data.data);
      toast.success('Website settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading website settings...</p>;
  if (!config) return <p className="text-muted-foreground">No website config found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hero Text</Label>
                <Input
                  value={config.heroText || ''}
                  onChange={(e) => setConfig({ ...config, heroText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Template</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={config.template || 'classic'}
                  onChange={(e) => setConfig({ ...config, template: e.target.value })}
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>About Text</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={config.aboutText || ''}
                onChange={(e) => setConfig({ ...config, aboutText: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                value={config.logo || ''}
                onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['primary', 'secondary', 'accent', 'background', 'text'].map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize">{key}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.colors?.[key] || '#000000'}
                      onChange={(e) =>
                        setConfig({ ...config, colors: { ...config.colors, [key]: e.target.value } })
                      }
                      className="h-10 w-10 rounded cursor-pointer border"
                    />
                    <Input
                      value={config.colors?.[key] || ''}
                      onChange={(e) =>
                        setConfig({ ...config, colors: { ...config.colors, [key]: e.target.value } })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
