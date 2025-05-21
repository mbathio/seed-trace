import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/utils/seedTypes";

interface NavbarProps {
  userRole?: UserRole;
  userName?: string;
}

const Navbar = ({ userRole, userName }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-isra-green px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            {/* Remplacé l'image du logo Lovable par simplement un texte ou un logo ISRA */}
            <span className="text-white text-xl font-bold">
              ISRA Saint-Louis
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 text-white">
          {userRole && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-isra-beige transition-colors"
              >
                Tableau de bord
              </Link>
              <Link
                to="/lots"
                className="hover:text-isra-beige transition-colors"
              >
                Lots de semences
              </Link>
              <Link
                to="/genealogy"
                className="hover:text-isra-beige transition-colors"
              >
                Généalogie
              </Link>
              {(userRole === "manager" || userRole === "admin") && (
                <Link
                  to="/reports"
                  className="hover:text-isra-beige transition-colors"
                >
                  Rapports
                </Link>
              )}
            </>
          )}
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          {userName ? (
            <div className="flex items-center">
              <span className="text-white hidden md:inline mr-2">
                {userName}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-isra-green"
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-isra-green"
              >
                Connexion
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && userRole && (
        <div className="md:hidden bg-isra-green-dark mt-1 py-2 px-4 rounded-b-lg">
          <div className="flex flex-col space-y-3 text-white">
            <Link
              to="/dashboard"
              className="hover:text-isra-beige transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tableau de bord
            </Link>
            <Link
              to="/lots"
              className="hover:text-isra-beige transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lots de semences
            </Link>
            <Link
              to="/genealogy"
              className="hover:text-isra-beige transition-colors py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Généalogie
            </Link>
            {(userRole === "manager" || userRole === "admin") && (
              <Link
                to="/reports"
                className="hover:text-isra-beige transition-colors py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rapports
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
