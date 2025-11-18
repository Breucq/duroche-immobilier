import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
    favoriteIds: string[];
    toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const FAVORITES_STORAGE_KEY = 'duroche_favorites';
    const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
            return storedFavorites ? JSON.parse(storedFavorites) : [];
        } catch (error) {
            console.error("Error reading favorites from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
        } catch (error) {
            console.error("Error saving favorites to localStorage", error);
        }
    }, [favoriteIds]);

    const toggleFavorite = (id: string) => {
        setFavoriteIds(prevIds => 
            prevIds.includes(id) ? prevIds.filter(favId => favId !== id) : [...prevIds, id]
        );
    };

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};