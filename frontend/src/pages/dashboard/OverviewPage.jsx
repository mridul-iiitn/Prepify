import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mealsAPI, ordersAPI, subscriptionsAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { UtensilsCrossed, ShoppingCart, CalendarCheck, DollarSign } from 'lucide-react';

export default function OverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ meals: 0, orders: 0, subscriptions: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mealsRes, ordersRes, subsRes] = await Promise.all([
          mealsAPI.getAll(),
          ordersAPI.getAll(),
          subscriptionsAPI.getAll(),
        ]);
        const orders = ordersRes.data.data || [];
        const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        setStats({
          meals: (mealsRes.data.data || []).length,
          orders: orders.length,
          subscriptions: Array.isArray(subsRes.data.data) ? subsRes.data.data.length : subsRes.data.data ? 1 : 0,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch {
        // Stats will remain 0
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Meals', value: stats.meals, icon: UtensilsCrossed, color: 'text-blue-600' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-green-600' },
    { title: 'Subscriptions', value: stats.subscriptions, icon: CalendarCheck, color: 'text-purple-600' },
    { title: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-yellow-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user?.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Order ID</th>
                    <th className="text-left py-2 px-3 font-medium">Customer</th>
                    <th className="text-left py-2 px-3 font-medium">Status</th>
                    <th className="text-right py-2 px-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0">
                      <td className="py-2 px-3 font-mono text-xs">{order._id.slice(-8)}</td>
                      <td className="py-2 px-3">{order.customerId?.name || 'N/A'}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">${order.totalAmount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
