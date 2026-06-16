// import { useState, useEffect } from "react";
// import { Link, useLocation } from "wouter";
// import { Search, MapPin, CalendarDays, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// // --- CLIENT REPLACEMENT INITIAL MOCK DATA ---
// const MOCK_CATEGORIES = [
//   { id: 1, name: "Music" },
//   { id: 2, name: "Sports" },
//   { id: 3, name: "Technology" },
//   { id: 4, name: "Education" }
// ];

// const MOCK_ALL_EVENTS = [
//   {
//     id: 1,
//     title: "Summer Music Festival 2026",
//     description: "Join us for the biggest music event of the summer!",
//     imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
//     categoryId: 1,
//     categoryName: "Music",
//     isFree: false,
//     price: "49.99",
//     location: "Metropolis Arena Park",
//     startDate: new Date().toISOString()
//   },
//   {
//     id: 2,
//     title: "World Tech Summit",
//     description: "Exploring the next frontier of artificial intelligence.",
//     imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
//     categoryId: 3,
//     categoryName: "Technology",
//     isFree: true,
//     location: "Silicon Convention Hall",
//     startDate: new Date().toISOString()
//   },
//   {
//     id: 3,
//     title: "Championship Basketball Finals",
//     description: "Watch live courtside legendary matchups.",
//     imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
//     categoryId: 2,
//     categoryName: "Sports",
//     isFree: false,
//     price: "75.00",
//     location: "Madison Center Garden",
//     startDate: new Date().toISOString()
//   },
//   {
//     id: 4,
//     title: "AI & Deep Learning BootCamp",
//     description: "Master modern neural networks over this intensive course.",
//     imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
//     categoryId: 3,
//     categoryName: "Technology",
//     isFree: false,
//     price: "29.99",
//     location: "Innovation Labs Hub",
//     startDate: new Date().toISOString()
//   },
//   {
//     id: 5,
//     title: "Acoustic Sunset Sessions",
//     description: "An intimate evening with raw indie-folk singer songwriters.",
//     imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
//     categoryId: 1,
//     categoryName: "Music",
//     isFree: true,
//     location: "The Rooftop Lounge",
//     startDate: new Date().toISOString()
//   }
// ];

// // Fallback Inline EventCard to prevent external cross-dependency breaks
// function EventCard({ event }) {
//   return (
//     <Link href={`/events/${event.id}`}>
//       <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group h-full">
//         <div className="aspect-video w-full relative bg-muted overflow-hidden">
//           {event.imageUrl && (
//             <img 
//               src={event.imageUrl} 
//               alt={event.title} 
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
//             />
//           )}
//         </div>
//         <CardContent className="p-4">
//           <Badge variant="secondary" className="mb-2">{event.categoryName}</Badge>
//           <h4 className="font-bold line-clamp-1 text-base group-hover:text-primary transition-colors">{event.title}</h4>
//           <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.location}</p>
//           <div className="mt-4 text-sm font-semibold text-primary">
//             {event.isFree ? "Free" : `$${event.price}`}
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }

// // --- MAIN HOME PAGE COMPONENT ---
// export default function HomePage() {
//   const [, setLocation] = useLocation();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeCategory, setActiveCategory] = useState(undefined);

//   // Simulated layout lifecycle state flags
//   const [isLoadingCategories, setIsLoadingCategories] = useState(false);
//   const [isLoadingTrending, setIsLoadingTrending] = useState(false);
//   const [isLoadingEvents, setIsLoadingEvents] = useState(false);

//   // Sync state loops to mock realistic database render latencies safely
//   useEffect(() => {
//     setIsLoadingCategories(true);
//     setIsLoadingTrending(true);
//     const timer = setTimeout(() => {
//       setIsLoadingCategories(false);
//       setIsLoadingTrending(false);
//     }, 200);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     setIsLoadingEvents(true);
//     const timer = setTimeout(() => {
//       setIsLoadingEvents(false);
//     }, 250);
//     return () => clearTimeout(timer);
//   }, [activeCategory]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       setLocation(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
//     }
//   };

//   // Compute filtering loops completely client-side over active values
//   const categories = MOCK_CATEGORIES;
//   const trendingEvents = MOCK_ALL_EVENTS.slice(0, 3); // Grab first 3 as hot list references

//   const filteredUpcoming = MOCK_ALL_EVENTS.filter(event => {
//     return activeCategory === undefined || event.categoryId === activeCategory;
//   }).slice(0, 6);

//   const eventsData = { events: filteredUpcoming };

//   return (
//     <div className="flex flex-col flex-1 pb-16">
//       {/* Hero Section */}
//       <section className="relative pt-24 pb-32 overflow-hidden bg-foreground text-background">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl mix-blend-screen" />
//           <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl mix-blend-screen" />
//         </div>
        
//         <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
//           <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight font-sans tracking-tight">
//             Don't miss out.<br/>
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
//               Experience it live.
//             </span>
//           </h1>
//           <p className="text-lg md:text-xl text-muted/80 mb-10 max-w-2xl">
//             The global platform for live experiences. Discover, create, and attend the world's most exciting events.
//           </p>
          
//           <form onSubmit={handleSearch} className="w-full max-w-2xl bg-background rounded-full p-2 flex items-center shadow-xl mb-8">
//             <div className="flex-1 flex items-center px-4 gap-2 text-foreground">
//               <Search className="w-5 h-5 text-muted-foreground" />
//               <Input 
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search events, organizers, or locations..."
//                 className="border-0 shadow-none focus-visible:ring-0 text-base py-6 h-auto bg-transparent"
//                 data-testid="input-hero-search"
//               />
//             </div>
//             <Button size="lg" type="submit" className="rounded-full px-8 py-6 h-auto text-lg font-bold" data-testid="button-hero-search">
//               Find Events
//             </Button>
//           </form>
          
//           {/* Quick Stats/Features */}
//           <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted/70">
//             <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> 10k+ Locations</div>
//             <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/> 50k+ Events Monthly</div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Strip */}
//       <section className="border-b bg-card sticky top-16 z-40">
//         <div className="container mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
//           <div className="flex items-center gap-3 min-w-max">
//             <Button 
//               variant={activeCategory === undefined ? "default" : "outline"}
//               className="rounded-full"
//               onClick={() => setActiveCategory(undefined)}
//               data-testid="button-category-all"
//             >
//               All Events
//             </Button>
//             {isLoadingCategories ? (
//               Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)
//             ) : categories?.map((cat) => (
//               <Button
//                 key={cat.id}
//                 variant={activeCategory === cat.id ? "default" : "outline"}
//                 className="rounded-full"
//                 onClick={() => setActiveCategory(cat.id)}
//                 data-testid={`button-category-${cat.id}`}
//               >
//                 {cat.name}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 mt-12 space-y-20">
        
//         {/* Trending Events */}
//         {activeCategory === undefined && (
//           <section>
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-3xl font-black">Trending Now</h2>
//               <Link href="/events">
//                 <Button variant="ghost" className="font-semibold group" data-testid="link-view-all-trending">
//                   View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {isLoadingTrending ? (
//                 Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
//               ) : trendingEvents?.map((event) => (
//                 <EventCard key={event.id} event={event} />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Featured / Category Events */}
//         <section>
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-3xl font-black">
//               {activeCategory ? categories?.find(c => c.id === activeCategory)?.name : "Upcoming Events"}
//             </h2>
//             <Link href={activeCategory ? `/events?category=${activeCategory}` : "/events"}>
//               <Button variant="ghost" className="font-semibold group" data-testid="link-view-all-upcoming">
//                 View More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {isLoadingEvents ? (
//               Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
//             ) : eventsData?.events.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))}
//             {!isLoadingEvents && eventsData?.events.length === 0 && (
//               <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
//                 No events found in this category.
//               </div>
//             )}
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback Inline EventCard to prevent external cross-dependency breaks
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
          <Badge variant="secondary" className="mb-2">{event.categoryName}</Badge>
          <h4 className="font-bold line-clamp-1 text-base group-hover:text-primary transition-colors">{event.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.location}</p>
          <div className="mt-4 text-sm font-semibold text-primary">
            {event.isFree ? "Free" : `$${event.price}`}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// --- MAIN HOME PAGE COMPONENT ---
export default function HomePage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(undefined);

  // Layout lifecycle state flags
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Data states
  const [categories, setCategories] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);

  // Fetch initial data from backend APIs
  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoadingCategories(true);
      setIsLoadingTrending(true);
      setIsLoadingEvents(true);

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

        // Fetch categories, all events, AND trending events from your separate endpoint
        const [categoriesRes, eventsRes, trendingRes] = await Promise.all([
          fetch(`${baseUrl}/api/categories`),
          fetch(`${baseUrl}/api/events`),
          fetch(`${baseUrl}/api/events/trending`) // Using your trending endpoint!
        ]);

        if (!categoriesRes.ok || !eventsRes.ok || !trendingRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData = await categoriesRes.json();
        const eventsResponse = await eventsRes.json();
        const trendingData = await trendingRes.json();

        // 1. Safely extract Categories
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : (categoriesData.categories || categoriesData.data || []);
        
        // 2. THE FIX: Extract 'events' from your controller's custom { events: [...], total } object
        const safeEvents = Array.isArray(eventsResponse) ? eventsResponse : (eventsResponse.events || []);

        // 3. Safely extract Trending (which your controller returns as a direct array)
        const safeTrending = Array.isArray(trendingData) ? trendingData : [];

        setCategories(safeCategories);
        setAllEvents(safeEvents);
        setTrendingEvents(safeTrending);

      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setIsLoadingCategories(false);
        setIsLoadingTrending(false);
        setIsLoadingEvents(false);
      }
    };

    fetchHomeData();
  }, []);

  // Retain simulated loading delay when swapping categories for UI feedback
  useEffect(() => {
    if (allEvents.length === 0) return;

    setIsLoadingEvents(true);
    const timer = setTimeout(() => {
      setIsLoadingEvents(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [activeCategory, allEvents.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Compute filtering loops completely client-side over active values
  const filteredUpcoming = allEvents.filter(event => {
    return activeCategory === undefined || event.categoryId === activeCategory;
  }).slice(0, 6);

  return (
    <div className="flex flex-col flex-1 pb-16">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl mix-blend-screen" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight font-sans tracking-tight">
            Don't miss out.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Experience it live.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted/80 mb-10 max-w-2xl">
            The global platform for live experiences. Discover, create, and attend the world's most exciting events.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-2xl bg-background rounded-full p-2 flex items-center shadow-xl mb-8">
            <div className="flex-1 flex items-center px-4 gap-2 text-foreground">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, organizers, or locations..."
                className="border-0 shadow-none focus-visible:ring-0 text-base py-6 h-auto bg-transparent"
                data-testid="input-hero-search"
              />
            </div>
            <Button size="lg" type="submit" className="rounded-full px-8 py-6 h-auto text-lg font-bold" data-testid="button-hero-search">
              Find Events
            </Button>
          </form>
          
          {/* Quick Stats/Features */}
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted/70">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> 10k+ Locations</div>
            <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/> 50k+ Events Monthly</div>
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="border-b bg-card sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 min-w-max">
            <Button 
              variant={activeCategory === undefined ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setActiveCategory(undefined)}
              data-testid="button-category-all"
            >
              All Events
            </Button>
            {isLoadingCategories ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)
            ) : categories?.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveCategory(cat.id)}
                data-testid={`button-category-${cat.id}`}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12 space-y-20">
        
        {/* Trending Events */}
        {activeCategory === undefined && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black">Trending Now</h2>
              <Link href="/events">
                <Button variant="ghost" className="font-semibold group" data-testid="link-view-all-trending">
                  View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingTrending ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
              ) : trendingEvents?.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Featured / Category Events */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black">
              {activeCategory ? categories?.find(c => c.id === activeCategory)?.name : "Upcoming Events"}
            </h2>
            <Link href={activeCategory ? `/events?category=${activeCategory}` : "/events"}>
              <Button variant="ghost" className="font-semibold group" data-testid="link-view-all-upcoming">
                View More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingEvents ? (
              Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
            ) : filteredUpcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {!isLoadingEvents && filteredUpcoming.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                No events found in this category.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}