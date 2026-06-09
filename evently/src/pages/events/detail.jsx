import { useParams, Link, useLocation } from "wouter";
import { format } from "date-fns";
import { Calendar, MapPin, Clock, ExternalLink, ShieldCheck, Tag, Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// --- CLIENT REPLACEMENT MOCK HOOKS ---
// Temporary Mock Data Store
const MOCK_EVENTS = {
  1: {
    id: 1,
    title: "Summer Music Festival 2026",
    description: "Join us for the biggest music event of the summer! Featuring international artists, amazing food trucks, and a vibrant community atmosphere. Fun for all ages.",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    categoryName: "Music",
    isFree: false,
    price: "49.99",
    organizerName: "Acme Productions",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14400000).toISOString(), // +4 hours
    location: "Metropolis Arena Park",
    url: "https://example.com/summer-music-fest"
  }
};

const useGetEvent = (id, options) => {
  // Grab from store or generate fallback structure dynamically
  const event = MOCK_EVENTS[id] || {
    id: id,
    title: `Dynamic Event #${id}`,
    description: "This is a placeholder description generated on-the-fly for any unexpected URL ID parameter pathing.",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    categoryName: "Technology",
    isFree: true,
    organizerName: "Global Innovators",
    startDate: new Date().toISOString(),
    location: "Online / Virtual Conference",
  };

  return { data: event, isLoading: false, error: null };
};

const useListRelatedEvents = (id, options) => {
  const list = [
    {
      id: 101,
      title: "Tech Summit 2026",
      description: "Exploring the next frontier of tech innovations.",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      categoryName: "Technology",
      isFree: false,
      price: "19.99",
      startDate: new Date().toISOString(),
      location: "Silicon Convention Hall"
    },
    {
      id: 102,
      title: "Community Coding BootCamp",
      description: "Learn web frameworks completely from scratch.",
      imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
      categoryName: "Technology",
      isFree: true,
      startDate: new Date().toISOString(),
      location: "Innovation Labs Hub"
    }
  ];
  return { data: list, isLoading: false };
};

const useCreateOrder = () => {
  const [isPending, setIsPending] = useState(false);
  const mutate = (payload, options) => {
    setIsPending(true);
    console.log("Mock Order Dispatched:", payload);
    
    setTimeout(() => {
      setIsPending(false);
      options?.onSuccess?.();
    }, 800);
  };
  return { mutate, isPending };
};

// Simplified EventCard mock component to avoid broken imports
function EventCard({ event }) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video w-full relative bg-muted">
        {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />}
      </div>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2">{event.categoryName}</Badge>
        <h4 className="font-bold line-clamp-1 text-base">{event.title}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.location}</p>
        <div className="mt-3 text-sm font-semibold text-primary">
          {event.isFree ? "Free" : `$${event.price}`}
        </div>
      </CardContent>
    </Card>
  );
}

// --- MAIN PAGE LAYOUT COMPONENT ---
export default function EventDetailPage() {
  const { id } = useParams();
  const eventId = Number(id) || 1; // Default to 1 if params missing
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: event, isLoading: isLoadingEvent, error } = useGetEvent(eventId);
  const { data: relatedEvents } = useListRelatedEvents(eventId);
  const createOrder = useCreateOrder();
  
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        // Clear transaction data inputs cleanly
        setBuyerName("");
        setBuyerEmail("");
        setQuantity(1);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to purchase tickets. Please try again.",
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

  const isPast = new Date(event.startDate) < new Date();

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