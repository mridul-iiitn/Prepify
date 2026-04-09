import { useEffect, useState } from 'react';
import { mealsAPI } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyMeal = { name: '', price: '', category: '', macros: { protein: '', carbs: '', fats: '', calories: '' } };

export default function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyMeal);

  const fetchMeals = async () => {
    try {
      const res = await mealsAPI.getAll();
      setMeals(res.data.data || []);
    } catch {
      toast.error('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      macros: {
        protein: Number(form.macros.protein) || 0,
        carbs: Number(form.macros.carbs) || 0,
        fats: Number(form.macros.fats) || 0,
        calories: Number(form.macros.calories) || 0,
      },
    };
    try {
      if (editing) {
        await mealsAPI.update(editing, payload);
        toast.success('Meal updated');
      } else {
        await mealsAPI.create(payload);
        toast.success('Meal created');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyMeal);
      fetchMeals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (meal) => {
    setForm({
      name: meal.name,
      price: meal.price.toString(),
      category: meal.category || '',
      macros: {
        protein: meal.macros?.protein?.toString() || '',
        carbs: meal.macros?.carbs?.toString() || '',
        fats: meal.macros?.fats?.toString() || '',
        calories: meal.macros?.calories?.toString() || '',
      },
    });
    setEditing(meal._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal?')) return;
    try {
      await mealsAPI.delete(id);
      toast.success('Meal deleted');
      fetchMeals();
    } catch {
      toast.error('Failed to delete meal');
    }
  };

  const updateMacro = (key) => (e) =>
    setForm({ ...form, macros: { ...form.macros, [key]: e.target.value } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meals</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyMeal); }}>
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Meal'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{editing ? 'Edit Meal' : 'New Meal'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g., high-protein" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Protein (g)</Label>
                  <Input type="number" min="0" value={form.macros.protein} onChange={updateMacro('protein')} />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (g)</Label>
                  <Input type="number" min="0" value={form.macros.carbs} onChange={updateMacro('carbs')} />
                </div>
                <div className="space-y-2">
                  <Label>Fats (g)</Label>
                  <Input type="number" min="0" value={form.macros.fats} onChange={updateMacro('fats')} />
                </div>
                <div className="space-y-2">
                  <Label>Calories</Label>
                  <Input type="number" min="0" value={form.macros.calories} onChange={updateMacro('calories')} />
                </div>
              </div>
              <Button type="submit">{editing ? 'Update Meal' : 'Create Meal'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading meals...</p>
      ) : meals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No meals yet. Add your first meal!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <Card key={meal._id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                  {meal.category && <Badge variant="secondary" className="mt-1">{meal.category}</Badge>}
                </div>
                <p className="text-xl font-bold text-primary">${meal.price.toFixed(2)}</p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                  <span>P: {meal.macros?.protein || 0}g</span>
                  <span>C: {meal.macros?.carbs || 0}g</span>
                  <span>F: {meal.macros?.fats || 0}g</span>
                  <span>{meal.macros?.calories || 0} cal</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(meal)}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(meal._id)} className="text-destructive">
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
