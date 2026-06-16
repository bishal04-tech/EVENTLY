import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Calendar, Ticket, LayoutDashboard, Search, ListPlus, Activity, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handler to clear auth session and kick user to login screen
  const handleLogout = () => {
    localStorage.removeItem("token");
    setMobileMenuOpen(false);
    setLocation("/login");
  };

  const navLinks = [
    { href: "/", label: "Discover", icon: Search },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: Ticket },
    { href: "/categories", label: "Categories", icon: ListPlus },
    { href: "/metrics", label: "Metrics", icon: Activity },
  ];

  // Simple token check to conditionally render the Logout button
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-sans font-black text-xl tracking-tight">Evently</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === link.href || (link.href !== '/' && location.startsWith(link.href))
                    ? "bg-secondary/10 text-secondary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/events/create">
            <Button className="font-semibold shadow-sm" data-testid="button-create-event">
              Create Event
            </Button>
          </Link>
          
          {/* Desktop Logout Button */}
          {isAuthenticated && (
            <Button 
              variant="outline" 
              className="font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-2"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg flex flex-col p-4 gap-2 animate-in slide-in-from-top-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href || (link.href !== '/' && location.startsWith(link.href))
                    ? "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-2 border-t flex flex-col gap-2">
            <Link href="/events/create" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center font-semibold" data-testid="button-mobile-create-event">
                Create Event
              </Button>
            </Link>

            {/* Mobile Logout Button */}
            {isAuthenticated && (
              <Button 
                variant="outline" 
                className="w-full justify-center font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-2"
                onClick={handleLogout}
                data-testid="button-mobile-logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}