
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-muted py-6 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-medium text-lg mb-4">ISRA Saint-Louis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Institut Sénégalais de Recherches Agricoles<br />
              Centre Régional de Saint-Louis<br />
              Route de Leybar, Saint-Louis, Sénégal
            </p>
            <div className="text-sm text-muted-foreground">
              <div>contact@isra.sn</div>
              <div>+221 33 961 17 51</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link to="/seed-lots" className="text-muted-foreground hover:text-foreground">
                  Lots de semences
                </Link>
              </li>
              <li>
                <Link to="/multipliers" className="text-muted-foreground hover:text-foreground">
                  Multiplicateurs
                </Link>
              </li>
              <li>
                <Link to="/inspections" className="text-muted-foreground hover:text-foreground">
                  Inspections
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-muted-foreground hover:text-foreground">
                  Rapports
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">À propos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ce système de traçabilité des semences a été développé pour l'ISRA afin d'assurer un suivi rigoureux 
              des semences GO, G1 et G2 et de leur descendance chez les multiplicateurs.
            </p>
            <p className="text-sm text-muted-foreground">
              Version 1.0 - 2023
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2023 ISRA - Institut Sénégalais de Recherches Agricoles. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
