

import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Keep categories mocked unless you have a dedicated GET /api/categories route
const MOCK_CATEGORIES = [
  { id: 1, name: "Music" },
  { id: 2, name: "Sports" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Education" }
];

function EventCard({ event }) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group h-full">
        <div className="aspect-video w-full relative bg-muted overflow-hidden">
          {event.imageUrl && (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          )}
        </div>
        <CardContent className="p-4">
          {event.categoryName && (
            <Badge variant="secondary" className="mb-2">{event.categoryName}</Badge>
          )}
          <h4 className="font-bold line-clamp-1 text-base group-hover:text-primary transition-colors">{event.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.location}</p>
          <div className="mt-4 text-sm font-semibold text-primary">
            {event.isFree ? "Free" : (event.price ? `$${event.price}` : "TBA")}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// --- MAIN EVENTS PAGE COMPONENT ---
export default function EventsPage() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const initialSearch = searchParams.get("search") || "";
  const initialCat = searchParams.get("category");
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCat || "all");
  
  const [eventsData, setEventsData] = useState({ events: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = MOCK_CATEGORIES;
  
  // 1. Debounce search string changes so we don't spam the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Fetch real data from the backend when search or category changes
 // 2. Fetch real data from the backend when search or category changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Construct query params
        const params = new URLSearchParams();
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (categoryId && categoryId !== "all") params.append("categoryId", categoryId);
        
        // Grab the base URL from your .env file
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        
        // Fetch from your Node.js backend using the base URL
        const response = await fetch(`${baseUrl}/api/events?${params.toString()}`);
        
        // Safety check to catch HTML responses and provide a clear error message
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("Received HTML instead of JSON. Check your backend server and CORS settings.");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch events data.");
        }
        
        const data = await response.json();
        setEventsData(data); // Expects { events: [...], total: X }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
        setEventsData({ events: [], total: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearch, categoryId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find the best live experiences across the globe.</p>
        </div>
        <Link href="/events/create">
          <Button size="lg" className="font-bold" data-testid="button-create-event-header">
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by name, location..." 
            className="pl-10 py-6 text-base bg-muted/50 border-none"
            data-testid="input-events-search"
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="py-6 text-base bg-muted/50 border-none" data-testid="select-category-filter">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-8 text-red-500 bg-red-50 border border-red-200 rounded-lg">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : eventsData.events.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-muted/20">
          <h3 className="text-2xl font-bold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">We couldn't find any events matching your criteria.</p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setCategoryId("all"); }} data-testid="button-clear-filters">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {eventsData.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}