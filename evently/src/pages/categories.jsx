import { useState, useEffect } from "react";
import { Plus, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// --- CLIENT REPLACEMENT INITIAL MOCK DATA ---
const INITIAL_MOCK_CATEGORIES = [
  { id: 1, name: "Music" },
  { id: 2, name: "Sports" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Education" }
];

export default function CategoriesPage() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();
  
  // Local state to simulate database management
  const [categories, setCategories] = useState(INITIAL_MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Optional: Simulate a brief initial layout scan load
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  // Inline dynamic hook simulation mapping cleanly to handle mutation submissions
  const handleCreate = (e) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) return;

    setIsPending(true);

    // Simulate standard network lifecycle latency
    setTimeout(() => {
      const generatedId = categories.length > 0 
        ? Math.max(...categories.map(c => c.id)) + 1 
        : 1;

      const newCategory = {
        id: generatedId,
        name: cleanName
      };

      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName("");
      setIsPending(false);

      toast({ title: "Category added" });
    }, 400);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <ListPlus className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1 text-lg">Organize events by topic or genre.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 bg-muted/20 border-b">
          <form onSubmit={handleCreate} className="flex gap-4">
            <Input 
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="e.g. Music, Tech, Sports..." 
              className="flex-1 bg-background text-lg py-6"
              disabled={isPending}
              data-testid="input-new-category"
            />
            <Button 
              type="submit" 
              size="lg" 
              className="px-8 font-bold"
              disabled={!newCategoryName.trim() || isPending}
              data-testid="button-add-category"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </form>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="divide-y">
              {categories.map((cat) => (
                <div key={cat.id} className="p-5 flex items-center justify-between hover:bg-muted/5 transition-colors">
                  <div className="font-semibold text-lg">{cat.name}</div>
                  <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    ID: {cat.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              No categories exist yet. Create one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}