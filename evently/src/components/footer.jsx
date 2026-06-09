import { Link } from "wouter";
import { Calendar, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" data-testid="link-footer-logo">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-sans font-black text-xl tracking-tight">Evently</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The global hub for live experiences. Discover, create, and attend events worldwide.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">All Events</Link></li>
              <li><Link href="/events?search=music" className="text-muted-foreground hover:text-primary transition-colors">Concerts</Link></li>
              <li><Link href="/events?search=tech" className="text-muted-foreground hover:text-primary transition-colors">Tech Conferences</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Organize</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events/create" className="text-muted-foreground hover:text-primary transition-colors">Create Event</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors">Orders</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Evently. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Built with passion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}