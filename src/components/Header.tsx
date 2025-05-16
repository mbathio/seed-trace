
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-primary text-primary-foreground shadow-md py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="bg-white rounded-full p-1.5 mr-3">
              <div className="w-8 h-8 bg-isra-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ISRA</span>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg md:text-xl">ISRA Saint-Louis</h1>
              <p className="text-xs opacity-90">Système de Traçabilité des Semences</p>
            </div>
          </Link>
        </div>

        {!isMobile && (
          <div className="hidden md:flex gap-1">
            <Link to="/">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                Tableau de bord
              </Button>
            </Link>
            <Link to="/seed-lots">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                Lots
              </Button>
            </Link>
            <Link to="/multipliers">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                Multiplicateurs
              </Button>
            </Link>
            <Link to="/inspections">
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                Inspections
              </Button>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsSearchOpen(true)}
            className="text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-5 w-5" />
          </Button>

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90">
                  <span className="sr-only">Menu</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-6 w-6"
                  >
                    <line x1="4" x2="20" y1="12" y2="12"></line>
                    <line x1="4" x2="20" y1="6" y2="6"></line>
                    <line x1="4" x2="20" y1="18" y2="18"></line>
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary text-primary-foreground">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="px-4 py-2 hover:bg-primary/90 rounded-md">
                    Tableau de bord
                  </Link>
                  <Link to="/seed-lots" className="px-4 py-2 hover:bg-primary/90 rounded-md">
                    Lots de semences
                  </Link>
                  <Link to="/multipliers" className="px-4 py-2 hover:bg-primary/90 rounded-md">
                    Multiplicateurs
                  </Link>
                  <Link to="/inspections" className="px-4 py-2 hover:bg-primary/90 rounded-md">
                    Inspections
                  </Link>
                  <Link to="/settings" className="px-4 py-2 hover:bg-primary/90 rounded-md">
                    Paramètres
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
