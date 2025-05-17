
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center min-h-[50vh] py-12 text-center">
        <div className="text-6xl font-bold text-isra-green mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée. 
          Veuillez vérifier l'URL ou retourner à l'accueil.
        </p>
        <Link to="/">
          <Button>
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
