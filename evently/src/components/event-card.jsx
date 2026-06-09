import { Link } from "wouter";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EventCard({ event }) {
  const isPast = new Date(event.startDate) < new Date();
  
  return (
    <Link href={`/events/${event.id}`} data-testid={`link-event-${event.id}`}>
      <Card className="h-full flex flex-col overflow-hidden hover-elevate transition-all group border-muted/50 hover:border-primary/20 bg-card cursor-pointer">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-primary/10 text-muted-foreground">
              <Calendar className="w-12 h-12 opacity-20" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur text-foreground border-none font-semibold">
              {event.isFree ? "Free" : event.price ? `$${event.price}` : "TBA"}
            </Badge>
            {event.categoryName && (
              <Badge variant="outline" className="bg-background/90 backdrop-blur border-none">
                {event.categoryName}
              </Badge>
            )}
          </div>
          
          {isPast && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="destructive" className="text-sm font-bold uppercase tracking-wider px-3 py-1">
                Past Event
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2">
            <span>{format(new Date(event.startDate), "MMM d, yyyy")}</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
            <span>{format(new Date(event.startDate), "h:mm a")}</span>
          </div>
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 flex-1">
          <div className="space-y-2 mt-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            {event.organizerName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 shrink-0 opacity-70" />
                <span className="line-clamp-1 truncate">{event.organizerName}</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t border-border/50 bg-muted/20 flex items-center justify-between">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {event.ticketsSold || 0} attending
          </div>
          <span className="text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
            Get Tickets →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}