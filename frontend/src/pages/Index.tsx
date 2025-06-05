
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-isra-green text-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Système de Traçabilité des Semences
              </h1>
              <p className="text-xl mb-6">
                La solution numérique de l'ISRA Saint-Louis pour assurer la traçabilité et la qualité des semences au Sénégal
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/login">
                  <Button className="bg-white text-isra-green hover:bg-gray-100 w-full sm:w-auto">
                    Se connecter
                  </Button>
                </Link>
                <a href="#fonctionnalites">
                  <Button variant="outline" className="border-white text-white hover:bg-isra-green-dark w-full sm:w-auto">
                    En savoir plus
                  </Button>
                </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="/placeholder.svg" 
                alt="ISRA Seed Traceability" 
                className="w-full max-w-md mx-auto rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-isra-green-dark">
                Pourquoi un système de traçabilité ?
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                L'ISRA de Saint-Louis est l'un des deux seuls établissements au Sénégal produisant des semences de niveaux GO, G1 et G2, essentielles pour la filière semencière nationale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-isra-green-light rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-isra-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Suivi Précis</h3>
                  <p className="text-gray-600">
                    Traçabilité complète de chaque lot de semences, de la production à la distribution aux multiplicateurs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-isra-brown-light rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-isra-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
                  <p className="text-gray-600">
                    Contrôles qualité à chaque étape pour garantir l'authenticité et la performance des semences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Données Fiables</h3>
                  <p className="text-gray-600">
                    Statistiques et rapports détaillés pour orienter les politiques semencières nationales.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="py-12 md:py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-isra-green-dark">
                Fonctionnalités du Système
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Une solution complète pour le suivi des semences à tous les niveaux de la chaîne de production.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <span className="inline-block p-3 rounded-full bg-isra-green-light text-isra-green">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Enregistrement des Lots</h3>
                <p className="text-gray-600">
                  Créez et suivez des lots de semences avec leurs caractéristiques complètes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <span className="inline-block p-3 rounded-full bg-amber-100 text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Codes QR</h3>
                <p className="text-gray-600">
                  Générez des codes QR uniques pour chaque lot facilitant l'identification et le suivi.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <span className="inline-block p-3 rounded-full bg-blue-100 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Généalogie des Semences</h3>
                <p className="text-gray-600">
                  Visualisez l'arbre généalogique complet de chaque lot de semences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <span className="inline-block p-3 rounded-full bg-isra-brown-light text-isra-brown">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Contrôle Qualité</h3>
                <p className="text-gray-600">
                  Enregistrez les tests de qualité et validez les lots conformes aux standards.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <span className="inline-block p-3 rounded-full bg-green-100 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Gestion des Parcelles</h3>
                <p className="text-gray-600">
                  Suivez les parcelles de production avec leurs caractéristiques et historiques.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                  <span className="inline-block p-3 rounded-full bg-purple-100 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Rapports et Statistiques</h3>
                <p className="text-gray-600">
                  Générez des rapports détaillés sur la production et la distribution des semences.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="bg-isra-green-light bg-opacity-20 rounded-xl p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-isra-green-dark mb-6">
                Prêt à commencer ?
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Connectez-vous au système de traçabilité des semences pour assurer un suivi optimal de votre production semencière.
              </p>
              <Link to="/login">
                <Button className="bg-isra-green hover:bg-isra-green-dark text-lg px-8 py-6 h-auto">
                  Accéder au système
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">ISRA Saint-Louis</p>
              <p className="text-sm text-gray-400">Système de Traçabilité des Semences</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="hover:text-isra-green-light">Accueil</Link>
              <Link to="/login" className="hover:text-isra-green-light">Connexion</Link>
              <a href="#" className="hover:text-isra-green-light">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} ISRA Saint-Louis. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
