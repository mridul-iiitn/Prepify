import { useEffect, useState } from 'react';
import { subscriptionsAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionsAPI.getAll();
      const data = res.data.data;
      setSubscriptions(Array.isArray(data) ? data : data ? [data] : []);
    } catch {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  const handleAction = async (id, action) => {
    try {
      await subscriptionsAPI[action](id);
      toast.success(`Subscription ${action}d`);
      fetchSubscriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} subscription`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading subscriptions...</p>
      ) : subscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No subscriptions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={sub._id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">
                    {sub.customerId?.name || 'Customer'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {sub.customerId?.email || ''}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
                  {sub.status}
                </span>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Meals/Week</p>
                    <p className="font-medium">{sub.mealsPerWeek}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Days</p>
                    <p className="font-medium capitalize">{sub.deliveryDays?.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Billing</p>
                    <p className="font-medium">{new Date(sub.nextBillingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plan</p>
                    <p className="font-medium capitalize">{sub.plan}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {sub.status === 'active' && (
                    <Button variant="outline" size="sm" onClick={() => handleAction(sub._id, 'pause')}>
                      Pause
                    </Button>
                  )}
                  {sub.status === 'paused' && (
                    <Button size="sm" onClick={() => handleAction(sub._id, 'resume')}>
                      Resume
                    </Button>
                  )}
                  {sub.status !== 'cancelled' && (
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleAction(sub._id, 'cancel')}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
