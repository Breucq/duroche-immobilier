import type { Alert } from '../types';

const STORAGE_KEY = 'duroche_alerts';

/**
 * Initialise la liste des alertes depuis le localStorage.
 * @returns {Alert[]} La liste des alertes.
 */
const initializeAlerts = (): Alert[] => {
  const storedAlerts = localStorage.getItem(STORAGE_KEY);
  if (storedAlerts) {
    try {
        const parsed = JSON.parse(storedAlerts);
        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch (e) {
        console.error("Échec de l'analyse des alertes depuis le localStorage", e);
    }
  }
  return [];
};

let alerts: Alert[] = initializeAlerts();

/**
 * Sauvegarde la liste actuelle des alertes dans le localStorage.
 */
const persistAlerts = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
};

export const alertService = {
  /**
   * Retourne toutes les alertes, triées par date de création la plus récente.
   * @returns {Alert[]} La liste des alertes.
   */
  getAll: (): Alert[] => {
    return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Ajoute une nouvelle alerte.
   * @param {string} email - L'email de l'utilisateur pour l'alerte.
   * @param {Alert['criteria']} criteria - Les critères de recherche de l'alerte.
   * @returns {Alert} La nouvelle alerte créée.
   */
  add: (email: string, criteria: Alert['criteria']): Alert => {
    const newId = alerts.length > 0 ? Math.max(...alerts.map(a => a.id)) + 1 : 1;
    const newAlert: Alert = {
        id: newId,
        email,
        criteria,
        createdAt: new Date().toISOString(),
    };
    alerts.push(newAlert);
    persistAlerts();
    return newAlert;
  },

  /**
   * Supprime une alerte par son ID.
   * @param {number} id - L'ID de l'alerte à supprimer.
   * @returns {boolean} `true` si la suppression a réussi, sinon `false`.
   */
  delete: (id: number): boolean => {
    const initialLength = alerts.length;
    alerts = alerts.filter(a => a.id !== id);
    if (alerts.length < initialLength) {
      persistAlerts();
      return true;
    }
    return false;
  },
};