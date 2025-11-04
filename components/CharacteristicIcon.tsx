import React from 'react';

interface CharacteristicIconProps extends React.SVGProps<SVGSVGElement> {
  characteristic: string;
}

/**
 * Affiche une icône générique (flèche dans un cercle) pour toutes les caractéristiques
 * d'un bien immobilier, afin de maintenir une cohérence visuelle.
 * La prop `characteristic` est ignorée pour garantir que la même icône est toujours utilisée.
 * @param {CharacteristicIconProps} props - Les propriétés du composant SVG.
 */
const CharacteristicIcon: React.FC<CharacteristicIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

export default CharacteristicIcon;