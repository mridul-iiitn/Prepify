import { useEffect, useState } from 'react';
import { ordersAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusFlow = ['pending', 'confirmed', 'preparing', 'delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const res = await ordersAPI.getAll(params);
      setOrders(res.data.data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    }
  };

  const getNextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].map((s) => (
          <Button
            key={s}
            variant={filter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s || 'All'}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">
                    Order #{order._id.slice(-8)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.customerId?.name || 'Unknown'} &middot;{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-bold">${order.totalAmount?.toFixed(2)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {order.deliveryDate && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-2">
                  {getNextStatus(order.status) && (
                    <Button size="sm" onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}>
                      Mark as {getNextStatus(order.status)}
                    </Button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleStatusUpdate(order._id, 'cancelled')}>
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
