import { useState, useEffect } from "react";
import { Calendar, DollarSign, Ticket, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// Fixed local EventCard component to replace the missing absolute import path safely
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

// --- MAIN DASHBOARD COMPONENT ---
export default function DashboardPage() {
  // Simulated load state hooks to replicate network lag authentically
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingCatStats, setIsLoadingCatStats] = useState(true);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  // Simulated KPI / Data stores
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);

  useEffect(() => {
    // Simulate real database population delay over components
    const timer = setTimeout(() => {
      setStats({
        totalRevenue: "12,450.00",
        totalOrders: 248,
        totalEvents: 42,
        upcomingEvents: 18,
        freeEvents: 15,
        paidEvents: 27
      });
      setIsLoadingStats(false);

      setCategoryStats([
        { categoryName: "Music", eventCount: 16 },
        { categoryName: "Sports", eventCount: 8 },
        { categoryName: "Technology", eventCount: 12 },
        { categoryName: "Education", eventCount: 6 }
      ]);
      setIsLoadingCatStats(false);

      setTrendingEvents([
        {
          id: 1,
          title: "Summer Music Festival 2026",
          location: "Metropolis Arena Park",
          categoryName: "Music",
          isFree: false,
          price: "49.99",
          imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
        },
        {
          id: 2,
          title: "World Tech Summit",
          location: "Silicon Convention Hall",
          categoryName: "Technology",
          isFree: true,
          imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
        },
        {
          id: 3,
          title: "Championship Basketball Finals",
          location: "Madison Center Garden",
          categoryName: "Sports",
          isFree: false,
          price: "75.00",
          imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc"
        },
        {
          id: 4,
          title: "AI & Deep Learning BootCamp",
          location: "Innovation Labs Hub",
          categoryName: "Technology",
          isFree: false,
          price: "29.99",
          imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
        }
      ]);
      setIsLoadingTrending(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Overview of your platform's performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? <Skeleton className="h-8 w-24" /> : (
              <div className="text-3xl font-black">${stats?.totalRevenue}</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Ticket className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-black">{stats?.totalOrders}</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <div className="w-8 h-8 rounded-full bg-chart-3/10 flex items-center justify-center text-chart-3">
              <Calendar className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-black">{stats?.totalEvents}</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
            <div className="w-8 h-8 rounded-full bg-chart-4/10 flex items-center justify-center text-chart-4">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? <Skeleton className="h-8 w-16" /> : (
              <div className="text-3xl font-black">{stats?.upcomingEvents}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Category Breakdown Pie Chart */}
        <Card className="shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Events by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {isLoadingCatStats ? (
              <Skeleton className="w-[200px] h-[200px] rounded-full" />
            ) : categoryStats && categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="eventCount"
                    nameKey="categoryName"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground">No category data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Free vs Paid Bar Chart */}
        <Card className="shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Free vs Paid Events</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {isLoadingStats ? (
              <Skeleton className="w-full h-[250px]" />
            ) : stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Free Events', count: stats.freeEvents || 0, fill: 'hsl(var(--chart-5))' },
                    { name: 'Paid Events', count: stats.paidEvents || 0, fill: 'hsl(var(--primary))' }
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {
                      [0,1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--chart-5))' : 'hsl(var(--primary))'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Top Events */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Performing Events</h2>
          <Link href="/events" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoadingTrending ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
          ) : trendingEvents?.slice(0, 4).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}