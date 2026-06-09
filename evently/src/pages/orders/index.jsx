import { useState, useEffect } from "react";
import { Search, Ticket, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// --- CLIENT REPLACEMENT MOCK DATA ---
const MOCK_ORDERS_LIST = [
  {
    id: 48102,
    eventId: 1,
    eventTitle: "Summer Music Festival 2026",
    buyerName: "Sarah Jenkins",
    buyerEmail: "sarah.j@example.com",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    quantity: 2,
    totalAmount: "99.98"
  },
  {
    id: 48103,
    eventId: 2,
    eventTitle: "World Tech Summit",
    buyerName: "Alex Rivera",
    buyerEmail: "arivera@techcorp.io",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    quantity: 1,
    totalAmount: "0.00"
  },
  {
    id: 48104,
    eventId: 1,
    eventTitle: "Summer Music Festival 2026",
    buyerName: "Michael Chang",
    buyerEmail: "mchang@example.com",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    quantity: 4,
    totalAmount: "199.96"
  }
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounce search string modifications
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Client-side execution of filter parameters over static mock rows
  const filteredOrders = MOCK_ORDERS_LIST.filter((order) => {
    if (!debouncedSearch) return true;
    const searchTarget = debouncedSearch.toLowerCase();
    return (
      order.buyerName.toLowerCase().includes(searchTarget) ||
      order.buyerEmail.toLowerCase().includes(searchTarget) ||
      order.eventTitle.toLowerCase().includes(searchTarget)
    );
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-lg">Manage and track ticket sales across all events.</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search by buyer name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
              data-testid="input-orders-search"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableHead>Order ID</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-mono text-xs font-medium">#{order.id.toString().padStart(6, '0')}</TableCell>
                    <TableCell>
                      <Link href={`/events/${order.eventId}`} className="font-semibold hover:text-primary transition-colors flex items-center gap-1 group/link">
                        {order.eventTitle}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.buyerName}</div>
                      <div className="text-xs text-muted-foreground">{order.buyerEmail}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">{order.quantity}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${order.totalAmount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Ticket className="w-10 h-10 mb-2 opacity-20" />
                      <p>No orders found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}