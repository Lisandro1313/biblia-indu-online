import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Favorito {
  ref: string;
  texto: string;
}

interface FavoritosCtx {
  favoritos: Favorito[];
  toggleFavorito: (fav: Favorito) => void;
  esFavorito: (ref: string) => boolean;
}

const FavoritosContext = createContext<FavoritosCtx>({
  favoritos: [],
  toggleFavorito: () => {},
  esFavorito: () => false,
});

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('favoritos_hindu').then(d => {
      if (d) setFavoritos(JSON.parse(d));
    });
  }, []);

  const toggleFavorito = (fav: Favorito) => {
    setFavoritos(prev => {
      const existe = prev.find(f => f.ref === fav.ref);
      const nueva = existe ? prev.filter(f => f.ref !== fav.ref) : [...prev, fav];
      AsyncStorage.setItem('favoritos_hindu', JSON.stringify(nueva));
      return nueva;
    });
  };

  const esFavorito = (ref: string) => favoritos.some(f => f.ref === ref);

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito, esFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export const useFavoritos = () => useContext(FavoritosContext);
