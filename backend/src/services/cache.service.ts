// backend/src/services/cache.service.ts

import NodeCache from "node-cache";
import Logger from "./logging.service";

/**
 * Service de cache pour optimiser les performances
 */
class CacheService {
  private static instance: CacheService;
  private cache: NodeCache;

  /**
   * Constructeur privé (pattern Singleton)
   */
  private constructor() {
    // Initialiser le cache avec une durée de vie standard de 5 minutes
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutes
      checkperiod: 60, // Vérifier les expirations toutes les 60 secondes
      useClones: false, // Ne pas cloner les objets pour améliorer les performances
    });

    // Logger l'initialisation du cache
    Logger.info("Cache service initialized", "CacheService");
  }

  /**
   * Obtenir l'instance du cache (Singleton)
   * @returns Instance du cache
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Récupérer une valeur du cache
   * @param key Clé de l'élément
   * @returns Valeur associée à la clé ou undefined si non trouvée
   */
  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Stocker une valeur dans le cache
   * @param key Clé de l'élément
   * @param value Valeur à stocker
   * @param ttl Durée de vie en secondes (optionnel)
   * @returns true si succès, false sinon
   */
  public set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set<T>(key, value, ttl);
  }

  /**
   * Vérifier si une clé existe dans le cache
   * @param key Clé à vérifier
   * @returns true si la clé existe, false sinon
   */
  public has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Supprimer une valeur du cache
   * @param key Clé à supprimer
   * @returns Nombre d'éléments supprimés (0 ou 1)
   */
  public delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Vider le cache
   * @returns true si succès, false sinon
   */
  public flush(): boolean {
    this.cache.flushAll();
    return true;
  }

  /**
   * Obtenir les statistiques du cache
   * @returns Statistiques du cache
   */
  public getStats() {
    return {
      keys: this.cache.keys(),
      stats: this.cache.getStats(),
      size: this.cache.keys().length,
    };
  }

  /**
   * Récupérer une valeur du cache ou l'y stocker si elle n'existe pas
   * @param key Clé de l'élément
   * @param fallback Fonction à exécuter pour obtenir la valeur si non trouvée
   * @param ttl Durée de vie en secondes (optionnel)
   * @returns Valeur associée à la clé
   */
  public async getOrSet<T>(
    key: string,
    fallback: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cachedValue = this.get<T>(key);

    if (cachedValue !== undefined) {
      return cachedValue;
    }

    try {
      const value = await fallback();
      this.set<T>(key, value, ttl);
      return value;
    } catch (error) {
      Logger.error(
        `Error fetching data for cache key: ${key}`,
        "CacheService",
        { error }
      );
      throw error;
    }
  }

  /**
   * Invalider toutes les clés correspondant à un modèle
   * @param pattern Modèle de clé (e.g., "seedLot:*")
   * @returns Nombre de clés invalidées
   */
  public invalidatePattern(pattern: string): number {
    const regex = new RegExp(pattern.replace("*", ".*"));
    const keys = this.cache.keys().filter((key) => regex.test(key));

    if (keys.length > 0) {
      this.cache.del(keys);
      Logger.debug(
        `Invalidated ${keys.length} cache keys with pattern ${pattern}`,
        "CacheService",
        { keys }
      );
    }

    return keys.length;
  }
}

// Exporter une instance singleton
const Cache = CacheService.getInstance();
export default Cache;
