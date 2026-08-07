

import { useState, useEffect, useCallback } from "react";
import { Plus, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function CategoriesPage() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const { toast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  // Safely grab the backend URL from Vite environment variables
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  // Fetch categories from the backend
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${cleanBaseUrl}/api/categories`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({ 
        title: "Connection Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }, [cleanBaseUrl, toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle the creation of a new category
  const handleCreate = async (e) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) return;

    setIsPending(true);

    try {
      // Your backend requires a numeric 'categoryId'. 
      // We calculate the next logical ID safely based on current data.
      const nextCategoryId = categories.length > 0 
        ? Math.max(...categories.map(c => c.categoryId || 0)) + 1 
        : 1;

      const response = await fetch(`${cleanBaseUrl}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: cleanName, 
          categoryId: nextCategoryId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      const newCategory = await response.json();
      
      // Update local state and sort alphabetically to match the backend's sort order
      setCategories(prev => {
        const updatedList = [...prev, newCategory];
        return updatedList.sort((a, b) => a.name.localeCompare(b.name));
      });
      
      setNewCategoryName("");
      toast({ title: "Category added successfully" });

    } catch (error) {
      toast({ 
        title: "Creation Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsPending(false);
    }
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
              {isPending ? "Adding..." : "Add"}
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
                  <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full font-mono uppercase">
                    {/* Displaying either the clean categoryId or slicing the long MongoDB ID for a cleaner UI */}
                    ID: {cat.categoryId || cat.id.slice(-6)}
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