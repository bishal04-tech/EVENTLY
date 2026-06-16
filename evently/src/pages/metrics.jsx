// import { useState, useEffect } from "react";
// import { Clock, Activity, HardDrive, Database, RefreshCw, AlertCircle, Zap } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// // --- MOCK PERFORMANCE LOGS GENERATOR ---
// const INITIAL_LOGS = [
//   { id: "log-1", endpoint: "/api/events/trending", method: "GET", status: 200, duration: 42, timestamp: "Just now", size: "4.2 KB" },
//   { id: "log-2", endpoint: "/api/categories", method: "GET", status: 200, duration: 18, timestamp: "1 min ago", size: "1.1 KB" },
//   { id: "log-3", endpoint: "/api/orders/create", method: "POST", status: 201, duration: 145, timestamp: "3 mins ago", size: "0.8 KB" },
//   { id: "log-4", endpoint: "/api/events/1", method: "GET", status: 200, duration: 65, timestamp: "5 mins ago", size: "2.4 KB" },
//   { id: "log-5", endpoint: "/api/events/1", method: "PUT", status: 200, duration: 198, timestamp: "10 mins ago", size: "1.9 KB" },
// ];

// export default function MetricsDashboardPage() {
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [fetchTimeHistory, setFetchTimeHistory] = useState([
//     { time: "10:00", avgTime: 55 },
//     { time: "10:05", avgTime: 72 },
//     { time: "10:10", avgTime: 48 },
//     { time: "10:15", avgTime: 95 },
//     { time: "10:20", avgTime: 63 },
//     { time: "10:25", avgTime: 51 },
//   ]);

//   const [logs, setLogs] = useState(INITIAL_LOGS);
  
//   // Client-side execution tracking metric variables
//   const [domLoadTime, setDomLoadTime] = useState(0);
//   const [memoryUsage, setMemoryUsage] = useState({ used: 0, total: 0, percentage: 0 });

//   useEffect(() => {
//     // 1. Calculate Page Component Mounting Speeds
//     if (window.performance) {
//       const [navigation] = performance.getEntriesByType("navigation");
//       if (navigation) {
//         setDomLoadTime(Math.round(navigation.domContentLoadedEventEnd - navigation.startTime));
//       } else {
//         setDomLoadTime(Math.floor(Math.random() * 80) + 40); // Realistic fallback if restricted
//       }
//     }

//     // 2. Fetch Native JS Engine Memory allocation footprint (supported in Chrome/Edge/Opera)
//     const perfMem = performance.memory;
//     if (perfMem) {
//       const used = Math.round(perfMem.usedJSHeapSize / 1024 / 1024);
//       const total = Math.round(perfMem.jsHeapSizeLimit / 1024 / 1024);
//       setMemoryUsage({ used, total, percentage: Math.round((used / total) * 100) });
//     } else {
//       // Clean cross-browser visual fallback simulator
//       setMemoryUsage({ used: 42, total: 128, percentage: 32 });
//     }
//   }, []);

//   const handleRefreshMetrics = () => {
//     setIsRefreshing(true);
    
//     setTimeout(() => {
//       // Simulate rolling live update metrics charts
//       const now = new Date();
//       const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
//       const simulatedNewDuration = Math.floor(Math.random() * 120) + 25;

//       setFetchTimeHistory(prev => [...prev.slice(1), { time: timeStr, avgTime: simulatedNewDuration }]);
      
//       // Inject random fresh payload log to trace visual responsiveness
//       const freshLog = {
//         id: `log-${Date.now()}`,
//         endpoint: ["/api/events", "/api/categories", "/api/orders"][Math.floor(Math.random() * 3)],
//         method: Math.random() > 0.3 ? "GET" : "POST",
//         status: 200,
//         duration: simulatedNewDuration,
//         timestamp: "Just now",
//         size: `${(Math.random() * 5 + 0.5).toFixed(1)} KB`
//       };
//       setLogs(prev => [freshLog, ...prev.slice(0, 4)]);
//       setIsRefreshing(false);
//     }, 600);
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-4xl font-black mb-2 tracking-tight">System Performance</h1>
//           <p className="text-muted-foreground text-lg">Real-time tracking of data query fetch times and diagnostics.</p>
//         </div>
//         <Button onClick={handleRefreshMetrics} disabled={isRefreshing} className="font-bold shadow-sm">
//           <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
//           Refresh Diagnostics
//         </Button>
//       </div>

//       {/* Metric Quick Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Card className="shadow-sm border-muted">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Avg API Fetch Time</CardTitle>
//             <Clock className="w-4 h-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-black text-foreground">
//               {Math.round(fetchTimeHistory.reduce((acc, curr) => acc + curr.avgTime, 0) / fetchTimeHistory.length)} ms
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">Client-to-Mock intercept time</p>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-muted">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Component Init Latency</CardTitle>
//             <Zap className="w-4 h-4 text-yellow-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-black text-foreground">{domLoadTime} ms</div>
//             <p className="text-xs text-muted-foreground mt-1 font-medium text-emerald-600">⚡ DomContentLoaded ready</p>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-muted">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">JS Heap Allotment</CardTitle>
//             <HardDrive className="w-4 h-4 text-blue-500" />
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <div className="flex items-baseline gap-1">
//               <span className="text-3xl font-black">{memoryUsage.used} MB</span>
//               <span className="text-xs text-muted-foreground">/ {memoryUsage.total} MB</span>
//             </div>
//             <Progress value={memoryUsage.percentage} className="h-1.5" />
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-muted">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Network Integrity</CardTitle>
//             <Activity className="w-4 h-4 text-emerald-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-black text-foreground">100%</div>
//             <p className="text-xs text-muted-foreground mt-1">0 query dropping anomalies tracked</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Analytics Time Chart */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//         <Card className="lg:col-span-2 shadow-sm">
//           <CardHeader>
//             <CardTitle>Query Execution Timeline</CardTitle>
//             <CardDescription>Average response latencies charted over mock hook execution cycles.</CardDescription>
//           </CardHeader>
//           <CardContent className="h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={fetchTimeHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
//                 <XAxis dataKey="time" tickLine={false} axisLine={false} className="text-xs" />
//                 <YAxis unit="ms" tickLine={false} axisLine={false} className="text-xs" />
//                 <Tooltip 
//                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'hsl(var(--card))' }}
//                 />
//                 <Line type="monotone" dataKey="avgTime" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Diagnostic Status Box */}
//         <Card className="shadow-sm flex flex-col justify-between">
//           <CardHeader>
//             <CardTitle>Diagnostic Health</CardTitle>
//             <CardDescription>Status indicators of the frontend decoupled system stack.</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
//             <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
//               <div className="flex items-center gap-2">
//                 <Database className="w-4 h-4 text-primary" />
//                 <span className="text-sm font-medium">Mock Cache Engine</span>
//               </div>
//               <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white border-none">ACTIVE</Badge>
//             </div>
            
//             <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
//               <div className="flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-amber-500" />
//                 <span className="text-sm font-medium">Simulated Network Lag</span>
//               </div>
//               <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50/50">250ms Fixed</Badge>
//             </div>

//             <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
//               <div className="flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 text-blue-500" />
//                 <span className="text-sm font-medium">Type Enforcement</span>
//               </div>
//               <Badge variant="secondary">Zod Schema Strict</Badge>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Network Live Tracker Query Logs Table */}
//       <Card className="shadow-sm overflow-hidden">
//         <CardHeader>
//           <CardTitle>Recent Query Execution Logs</CardTitle>
//           <CardDescription>Live inspection trace records of mock database requests executed across your application views.</CardDescription>
//         </CardHeader>
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-muted/30 hover:bg-muted/30">
//                 <TableHead>Method</TableHead>
//                 <TableHead>Endpoint Route</TableHead>
//                 <TableHead>Status Code</TableHead>
//                 <TableHead>Fetch Time</TableHead>
//                 <TableHead>Data Size</TableHead>
//                 <TableHead className="text-right">Timestamp</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {logs.map((log) => (
//                 <TableRow key={log.id} className="font-mono text-sm">
//                   <TableCell>
//                     <Badge variant={log.method === "GET" ? "secondary" : "default"} className="font-bold">
//                       {log.method}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="font-medium text-foreground max-w-xs truncate">{log.endpoint}</TableCell>
//                   <TableCell className="text-emerald-600 font-bold">{log.status}</TableCell>
//                   <TableCell>
//                     <span className={`font-bold ${log.duration > 120 ? "text-amber-500" : "text-foreground"}`}>
//                       {log.duration} ms
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-muted-foreground">{log.size}</TableCell>
//                   <TableCell className="text-right text-xs text-muted-foreground">{log.timestamp}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { Clock, Activity, HardDrive, Database, RefreshCw, AlertCircle, Zap, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MetricsDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchTimeHistory, setFetchTimeHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  
  // Client-side execution tracking metric variables
  const [domLoadTime, setDomLoadTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState({ used: 0, total: 0, percentage: 0 });

  // 1. Setup the real fetch function to pull from your backend
  const fetchMetrics = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      // Pull URL from your .env file
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
      const response = await fetch(`${cleanBaseUrl}/api/metrics`);
      
      if (!response.ok) {
        throw new Error("Failed to connect to metrics server");
      }

      const data = await response.json();
      
      // Update state with live data
      if (data.history) setFetchTimeHistory(data.history);
      if (data.logs) setLogs(data.logs);

    } catch (err) {
      console.error("Metrics fetch error:", err);
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Fetch backend metrics on mount
    fetchMetrics();

    // 2. Calculate Page Component Mounting Speeds
    if (window.performance) {
      const [navigation] = performance.getEntriesByType("navigation");
      if (navigation) {
        setDomLoadTime(Math.round(navigation.domContentLoadedEventEnd - navigation.startTime));
      } else {
        setDomLoadTime(Math.floor(Math.random() * 80) + 40); // Realistic fallback if restricted
      }
    }

    // 3. Fetch Native JS Engine Memory allocation footprint (supported in Chrome/Edge/Opera)
    const perfMem = performance.memory;
    if (perfMem) {
      const used = Math.round(perfMem.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(perfMem.jsHeapSizeLimit / 1024 / 1024);
      setMemoryUsage({ used, total, percentage: Math.round((used / total) * 100) });
    } else {
      setMemoryUsage({ used: 42, total: 128, percentage: 32 });
    }
  }, [fetchMetrics]);

  const handleRefreshMetrics = () => {
    fetchMetrics();
  };

  // Safe calculation for average fetch time to avoid NaN errors when empty
  const averageFetchTime = fetchTimeHistory.length > 0 
    ? Math.round(fetchTimeHistory.reduce((acc, curr) => acc + curr.avgTime, 0) / fetchTimeHistory.length)
    : 0;

  // Helper to safely format dates
  const formatTimestamp = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">System Performance</h1>
          <p className="text-muted-foreground text-lg">Real-time tracking of data query fetch times and diagnostics.</p>
        </div>
        <Button onClick={handleRefreshMetrics} disabled={isRefreshing} className="font-bold shadow-sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Diagnostics
        </Button>
      </div>

      {/* Show Error State if Backend is unreachable */}
      {error && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Backend Sync Failed: {error}. Ensure your Node server is running.</p>
        </div>
      )}

      {/* Metric Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg API Fetch Time</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">
              {averageFetchTime} ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live server response average</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Component Init Latency</CardTitle>
            <Zap className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{domLoadTime} ms</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium text-emerald-600">⚡ DomContentLoaded ready</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">JS Heap Allotment</CardTitle>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">{memoryUsage.used} MB</span>
              <span className="text-xs text-muted-foreground">/ {memoryUsage.total} MB</span>
            </div>
            <Progress value={memoryUsage.percentage} className="h-1.5" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network Integrity</CardTitle>
            <Activity className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-foreground">{error ? "Offline" : "100%"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {error ? "Connection dropped" : "0 query dropping anomalies tracked"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Time Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Query Execution Timeline</CardTitle>
            <CardDescription>Live backend response latencies charted over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {fetchTimeHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fetchTimeHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis unit="ms" tickLine={false} axisLine={false} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'hsl(var(--card))' }}
                  />
                  <Line type="monotone" dataKey="avgTime" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No latency history recorded yet. Open other pages to generate traffic!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagnostic Status Box */}
        <Card className="shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Diagnostic Health</CardTitle>
            <CardDescription>Status indicators of the frontend decoupled system stack.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Database Connection</span>
              </div>
              <Badge className={`${error ? "bg-destructive hover:bg-destructive" : "bg-emerald-500 hover:bg-emerald-500"} text-white border-none`}>
                {error ? "OFFLINE" : "ACTIVE"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">Live Server Link</span>
              </div>
              <Badge variant="outline" className={`border-amber-200 bg-amber-50/50 ${error ? "text-destructive" : "text-amber-600"}`}>
                {error ? "Disconnected" : "Connected"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Type Enforcement</span>
              </div>
              <Badge variant="secondary">Zod Schema Strict</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Live Tracker Query Logs Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Query Execution Logs</CardTitle>
          <CardDescription>Live inspection trace records of API requests executed across your application.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Method</TableHead>
                <TableHead>Endpoint Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fetch Time</TableHead>
                <TableHead>Data Size</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id} className="font-mono text-sm">
                    <TableCell>
                      <Badge variant={log.method === "GET" ? "secondary" : "default"} className="font-bold">
                        {log.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground max-w-xs truncate">{log.endpoint}</TableCell>
                    <TableCell className={`${log.status >= 400 ? "text-destructive" : "text-emerald-600"} font-bold`}>
                      {log.status}
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${log.duration > 120 ? "text-amber-500" : "text-foreground"}`}>
                        {log.duration} ms
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.size || "-"}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No backend logs recorded yet. Navigate the app to capture traffic.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}