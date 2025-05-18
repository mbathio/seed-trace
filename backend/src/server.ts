import app from "./app";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

// Définir le port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
