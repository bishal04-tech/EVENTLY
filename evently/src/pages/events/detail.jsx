

// import { useParams, Link, useLocation } from "wouter";
// import { format } from "date-fns";
// import { Calendar, MapPin, Clock, ExternalLink, ShieldCheck, Tag, Pencil, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useState, useEffect } from "react";
// import { useToast } from "@/hooks/use-toast";

// // --- API CONFIGURATION ---
// // Safely falls back to an empty string if the environment variable isn't found
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// // --- DATA FETCHING HOOKS ---
// const useGetEvent = (id) => {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
//         if (!response.ok) {
//           throw new Error(response.status === 404 ? "Event not found" : "Failed to fetch event details");
//         }
//         const jsonData = await response.json();
//         setData(jsonData);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchEvent();
//   }, [id]);

//   return { data, isLoading, error };
// };

// const useListRelatedEvents = (id) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchRelated = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/events/${id}/related`);
//         if (response.ok) {
//           const jsonData = await response.json();
//           setData(jsonData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch related events:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) fetchRelated();
//   }, [id]);

//   return { data, isLoading };
// };

// const useCreateOrder = () => {
//   const [isPending, setIsPending] = useState(false);

//   const mutate = async (payload, options) => {
//     setIsPending(true);
//     try {
//       // Assuming your orders endpoint is /api/orders
//       const response = await fetch(`${API_BASE_URL}/api/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Add 'Authorization': `Bearer ${token}` here if this endpoint is protected
//         },
//         body: JSON.stringify(payload.data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || "Transaction failed");
//       }

//       setIsPending(false);
//       options?.onSuccess?.();
//     } catch (error) {
//       setIsPending(false);
//       options?.onError?.(error);
//     }
//   };

//   return { mutate, isPending };
// };

// // --- COMPONENTS ---
// function EventCard({ event }) {
//   return (
//     <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//       <div className="aspect-video w-full relative bg-muted">
//         {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />}
//       </div>
//       <CardContent className="p-4">
//         {event.categoryName && (
//           <Badge variant="secondary" className="mb-2">{event.categoryName}</Badge>
//         )}
//         <h4 className="font-bold line-clamp-1 text-base">{event.title}</h4>
//         <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.location}</p>
//         <div className="mt-3 text-sm font-semibold text-primary">
//           {event.isFree ? "Free" : event.price ? `$${event.price}` : "TBA"}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// // --- MAIN PAGE LAYOUT COMPONENT ---
// export default function EventDetailPage() {
//   const { id } = useParams();
//   const eventId = id || "1"; 
//   const [, setLocation] = useLocation();
//   const { toast } = useToast();
  
//   const { data: event, isLoading: isLoadingEvent, error } = useGetEvent(eventId);
//   console.log("Event Data from Backend:", event);
//   console.log("Any Errors?:", error);
//   const { data: relatedEvents } = useListRelatedEvents(eventId);
//   const createOrder = useCreateOrder();
  
//   const [buyerName, setBuyerName] = useState("");
//   const [buyerEmail, setBuyerEmail] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const handlePurchase = (e) => {
//     e.preventDefault();
//     if (!event) return;
    
//     const priceNum = event.price ? parseFloat(event.price) : 0;
//     const totalAmount = event.isFree ? "0.00" : (priceNum * quantity).toFixed(2);
    
//     createOrder.mutate({
//       data: {
//         eventId: event.id, // Formatted nicely from your backend's buildEventRow
//         buyerName,
//         buyerEmail,
//         quantity,
//         totalAmount
//       }
//     }, {
//       onSuccess: () => {
//         toast({
//           title: "Tickets Purchased!",
//           description: `You've successfully secured ${quantity} ticket(s) to ${event.title}.`,
//         });
//         setIsDialogOpen(false);
//         setBuyerName("");
//         setBuyerEmail("");
//         setQuantity(1);
//       },
//       onError: (error) => {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: error.message || "Failed to purchase tickets. Please try again.",
//         });
//       }
//     });
//   };

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-20 text-center">
//         <h2 className="text-2xl font-bold mb-4">Event not found</h2>
//         <Link href="/events">
//           <Button>Back to Events</Button>
//         </Link>
//       </div>
//     );
//   }

//   if (isLoadingEvent || !event) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Skeleton className="w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl mb-8" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-4">
//             <Skeleton className="h-12 w-3/4" />
//             <Skeleton className="h-6 w-1/4" />
//             <Skeleton className="h-32 w-full mt-8" />
//           </div>
//           <Skeleton className="h-80 w-full" />
//         </div>
//       </div>
//     );
//   }

//   // Determine if the event is already in the past
//   const isPast = event.startDate ? new Date(event.startDate) < new Date() : false;

//   return (
//     <div className="bg-muted/10 min-h-full pb-20">
//       {/* Hero Image Section */}
//       <div className="w-full bg-background border-b">
//         <div className="container mx-auto px-4 py-6">
//           <Link href="/events" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
//             <ArrowLeft className="w-4 h-4 mr-2" /> Back to all events
//           </Link>
          
//           <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden bg-muted mb-8 shadow-md">
//             {event.imageUrl ? (
//               <img 
//                 src={event.imageUrl} 
//                 alt={event.title} 
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
//                 <Calendar className="w-20 h-20 text-muted-foreground/30 mb-4" />
//                 <span className="text-muted-foreground font-medium">{event.title}</span>
//               </div>
//             )}
            
//             {isPast && (
//               <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
//                 <Badge variant="destructive" className="text-2xl font-bold uppercase tracking-widest px-6 py-2 shadow-xl">
//                   Past Event
//                 </Badge>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-10">
//             <div>
//               <div className="flex flex-wrap items-center gap-3 mb-4">
//                 {event.categoryName && (
//                   <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
//                     {event.categoryName}
//                   </Badge>
//                 )}
//                 <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
//                   {event.isFree ? "Free Event" : `Paid Event`}
//                 </Badge>
//               </div>
              
//               <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
//                 {event.title}
//               </h1>
              
//               <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
//                 <div className="flex items-center gap-1">
//                   <ShieldCheck className="w-4 h-4 text-green-500" />
//                   Organized by <span className="text-foreground">{event.organizerName || "Evently Organizer"}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="prose prose-lg dark:prose-invert max-w-none">
//               <h3 className="text-2xl font-bold mb-4 font-sans tracking-tight">About this event</h3>
//               {event.description ? (
//                 <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
//                   {event.description}
//                 </div>
//               ) : (
//                 <p className="text-muted-foreground italic">No description provided.</p>
//               )}
//             </div>

//             {event.url && (
//               <div className="flex items-center p-4 rounded-xl bg-card border shadow-sm">
//                 <ExternalLink className="w-5 h-5 mr-3 text-muted-foreground" />
//                 <div className="flex-1">
//                   <div className="text-sm font-medium">Event Website</div>
//                   <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline line-clamp-1">
//                     {event.url}
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <Card className="sticky top-24 border-primary/10 shadow-lg overflow-hidden">
//               <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
//               <CardContent className="p-6">
//                 <div className="text-3xl font-black mb-6">
//                   {event.isFree ? "Free" : event.price ? `$${event.price}` : "TBA"}
//                 </div>
                
//                 <div className="space-y-4 mb-8">
//                   {event.startDate && (
//                     <div className="flex gap-3">
//                       <Calendar className="w-5 h-5 shrink-0 text-primary mt-0.5" />
//                       <div>
//                         <div className="font-semibold">{format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {format(new Date(event.startDate), "h:mm a")} 
//                           {event.endDate && ` - ${format(new Date(event.endDate), "h:mm a")}`}
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="flex gap-3">
//                     <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
//                     <div>
//                       <div className="font-semibold line-clamp-2">{event.location}</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   {!isPast ? (
//                     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                       <DialogTrigger asChild>
//                         <Button size="lg" className="w-full text-lg font-bold py-6 shadow-md" data-testid="button-get-tickets">
//                           Get Tickets
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-[425px]">
//                         <DialogHeader>
//                           <DialogTitle>Get Tickets</DialogTitle>
//                           <DialogDescription>
//                             Secure your spot for {event.title}.
//                           </DialogDescription>
//                         </DialogHeader>
//                         <form onSubmit={handlePurchase} className="space-y-4 pt-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="name">Full Name</Label>
//                             <Input 
//                               id="name" 
//                               required 
//                               value={buyerName}
//                               onChange={e => setBuyerName(e.target.value)}
//                               placeholder="John Doe" 
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input 
//                               id="email" 
//                               type="email" 
//                               required 
//                               value={buyerEmail}
//                               onChange={e => setBuyerEmail(e.target.value)}
//                               placeholder="john@example.com" 
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="quantity">Quantity</Label>
//                             <Input 
//                               id="quantity" 
//                               type="number" 
//                               min="1" 
//                               max="10" 
//                               required 
//                               value={quantity}
//                               onChange={e => setQuantity(parseInt(e.target.value) || 1)}
//                             />
//                           </div>
                          
//                           <div className="pt-4 border-t flex justify-between items-center font-bold text-lg">
//                             <span>Total</span>
//                             <span>
//                               {event.isFree ? "Free" : `$${((event.price ? parseFloat(event.price) : 0) * quantity).toFixed(2)}`}
//                             </span>
//                           </div>
                          
//                           <Button 
//                             type="submit" 
//                             className="w-full" 
//                             disabled={createOrder.isPending}
//                             data-testid="button-confirm-purchase"
//                           >
//                             {createOrder.isPending ? "Processing..." : "Complete Purchase"}
//                           </Button>
//                         </form>
//                       </DialogContent>
//                     </Dialog>
//                   ) : (
//                     <Button size="lg" className="w-full py-6" disabled variant="secondary">
//                       Sales Ended
//                     </Button>
//                   )}
                  
//                   <Link href={`/events/${event.id}/edit`}>
//                     <Button variant="outline" className="w-full" data-testid="button-edit-event">
//                       <Pencil className="w-4 h-4 mr-2" />
//                       Edit Event
//                     </Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Related Events */}
//         {relatedEvents && relatedEvents.length > 0 && (
//           <div className="mt-20 pt-10 border-t">
//             <h2 className="text-3xl font-black mb-8">More from this category</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {relatedEvents.slice(0, 4).map((relatedEvent) => (
//                 <EventCard key={relatedEvent.id} event={relatedEvent} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useParams, Link, useLocation } from "wouter";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, ExternalLink, ShieldCheck, Tag, Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// --- API CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// --- DATA FETCHING HOOKS ---
const useGetEvent = (id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? "Event not found" : "Failed to fetch event details");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  return { data, isLoading, error };
};

const useListRelatedEvents = (id) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${id}/related`);
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        }
      } catch (err) {
        console.error("Failed to fetch related events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchRelated();
  }, [id]);

  return { data, isLoading };
};

const useCreateOrder = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (payload, options) => {
    setIsPending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload.data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Transaction failed");
      }

      setIsPending(false);
      options?.onSuccess?.();
    } catch (error) {
      setIsPending(false);
      options?.onError?.(error);
    }
  };

  return { mutate, isPending };
};

// --- NEW DELETE HOOK ---
const useDeleteEvent = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (id, options) => {
    setIsPending(true);
    try {
      // Grab your auth token (replace this with your actual token retrieval logic)
      const token = localStorage.getItem("token") || sessionStorage.getItem("token"); 

      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Pass the Bearer token to authorize the request
          ...(token && { "Authorization": `Bearer ${token}` }),
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete event");
      }

      setIsPending(false);
      options?.onSuccess?.();
    } catch (error) {
      setIsPending(false);
      options?.onError?.(error);
    }
  };

  return { mutate, isPending };
};
// --- COMPONENTS ---
function EventCard({ event }) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video w-full relative bg-muted">
        {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />}
      </div>
      <CardContent className="p-4">
        {event.categoryName && (
          <Badge variant="secondary" className="mb-2">{event.categoryName}</Badge>
        )}
        <h4 className="font-bold line-clamp-1 text-base">{event.title}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.location}</p>
        <div className="mt-3 text-sm font-semibold text-primary">
          {event.isFree ? "Free" : event.price ? `$${event.price}` : "TBA"}
        </div>
      </CardContent>
    </Card>
  );
}

// --- MAIN PAGE LAYOUT COMPONENT ---
export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = id || "1"; 
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: event, isLoading: isLoadingEvent, error } = useGetEvent(eventId);
  const { data: relatedEvents } = useListRelatedEvents(eventId);
  const createOrder = useCreateOrder();
  const deleteEventHook = useDeleteEvent();
  
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handlePurchase = (e) => {
    e.preventDefault();
    if (!event) return;
    
    const priceNum = event.price ? parseFloat(event.price) : 0;
    const totalAmount = event.isFree ? "0.00" : (priceNum * quantity).toFixed(2);
    
    createOrder.mutate({
      data: {
        eventId: event.id,
        buyerName,
        buyerEmail,
        quantity,
        totalAmount
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Tickets Purchased!",
          description: `You've successfully secured ${quantity} ticket(s) to ${event.title}.`,
        });
        setIsDialogOpen(false);
        setBuyerName("");
        setBuyerEmail("");
        setQuantity(1);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to purchase tickets. Please try again.",
        });
      }
    });
  };

  const handleDeleteEvent = () => {
    if (!event) return;
    
    deleteEventHook.mutate(event.id, {
      onSuccess: () => {
        toast({
          title: "Event Deleted",
          description: "The event was successfully removed.",
        });
        setIsDeleteOpen(false);
        setLocation("/events"); // Redirect safely to home/list route
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Could not complete deletion. Make sure you are authorized.",
        });
      }
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    );
  }

  if (isLoadingEvent || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full mt-8" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  const isPast = event.startDate ? new Date(event.startDate) < new Date() : false;

  return (
    <div className="bg-muted/10 min-h-full pb-20">
      {/* Hero Image Section */}
      <div className="w-full bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/events" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all events
          </Link>
          
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden bg-muted mb-8 shadow-md">
            {event.imageUrl ? (
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <Calendar className="w-20 h-20 text-muted-foreground/30 mb-4" />
                <span className="text-muted-foreground font-medium">{event.title}</span>
              </div>
            )}
            
            {isPast && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="text-2xl font-bold uppercase tracking-widest px-6 py-2 shadow-xl">
                  Past Event
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {event.categoryName && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    {event.categoryName}
                  </Badge>
                )}
                <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
                  {event.isFree ? "Free Event" : `Paid Event`}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                {event.title}
              </h1>
              
              <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Organized by <span className="text-foreground">{event.organizerName || "Evently Organizer"}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold mb-4 font-sans tracking-tight">About this event</h3>
              {event.description ? (
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {event.description}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No description provided.</p>
              )}
            </div>

            {event.url && (
              <div className="flex items-center p-4 rounded-xl bg-card border shadow-sm">
                <ExternalLink className="w-5 h-5 mr-3 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Event Website</div>
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline line-clamp-1">
                    {event.url}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-primary/10 shadow-lg overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
              <CardContent className="p-6">
                <div className="text-3xl font-black mb-6">
                  {event.isFree ? "Free" : event.price ? `$${event.price}` : "TBA"}
                </div>
                
                <div className="space-y-4 mb-8">
                  {event.startDate && (
                    <div className="flex gap-3">
                      <Calendar className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <div className="font-semibold">{format(new Date(event.startDate), "EEEE, MMMM d, yyyy")}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.startDate), "h:mm a")} 
                          {event.endDate && ` - ${format(new Date(event.endDate), "h:mm a")}`}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold line-clamp-2">{event.location}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {!isPast ? (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="w-full text-lg font-bold py-6 shadow-md" data-testid="button-get-tickets">
                          Get Tickets
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Get Tickets</DialogTitle>
                          <DialogDescription>
                            Secure your spot for {event.title}.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePurchase} className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              required 
                              value={buyerName}
                              onChange={e => setBuyerName(e.target.value)}
                              placeholder="John Doe" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              required 
                              value={buyerEmail}
                              onChange={e => setBuyerEmail(e.target.value)}
                              placeholder="john@example.com" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input 
                              id="quantity" 
                              type="number" 
                              min="1" 
                              max="10" 
                              required 
                              value={quantity}
                              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                            />
                          </div>
                          
                          <div className="pt-4 border-t flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>
                              {event.isFree ? "Free" : `$${((event.price ? parseFloat(event.price) : 0) * quantity).toFixed(2)}`}
                            </span>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={createOrder.isPending}
                            data-testid="button-confirm-purchase"
                          >
                            {createOrder.isPending ? "Processing..." : "Complete Purchase"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button size="lg" className="w-full py-6" disabled variant="secondary">
                      Sales Ended
                    </Button>
                  )}
                  
                  <Link href={`/events/${event.id}/edit`}>
                    <Button variant="outline" className="w-full" data-testid="button-edit-event">
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Event
                    </Button>
                  </Link>

                  {/* --- DROP-IN DELETE EVENT BUTTON & DIALOG --- */}
                  <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full" data-testid="button-delete-event">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                          <Trash2 className="w-5 h-5" /> Delete Event
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                          Are you absolutely sure you want to delete <strong>{event.title}</strong>? This action cannot be undone and will permanently erase this event record.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={deleteEventHook.isPending}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteEvent} disabled={deleteEventHook.isPending}>
                          {deleteEventHook.isPending ? "Deleting..." : "Confirm Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents && relatedEvents.length > 0 && (
          <div className="mt-20 pt-10 border-t">
            <h2 className="text-3xl font-black mb-8">More from this category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedEvents.slice(0, 4).map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}