import { useState, useEffect } from 'react';
import { useGameUniverse } from '../context/GameUniverseContext';
import './DynamicBackground.css';

const leagueImages = import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const countryImages = import.meta.glob('../assets/backgrounds_country/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });

export default function DynamicBackground() {
  const { universe } = useGameUniverse();
  const images = universe === 'league' ? leagueImages : countryImages;
  const imageUrls = Object.values(images) as string[];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when changing universe
  useEffect(() => {
    setCurrentIndex(0);
  }, [universe]);

  useEffect(() => {
    if (imageUrls.length <= 1) return; // Pas besoin de tourner s'il y a 0 ou 1 image

    // Changer toutes les 5 minutes (300 000 ms)
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (imageUrls.length === 0) {
    return <div className="dynamic-bg-container bg-[#14141e]"></div>;
  }

  return (
    <>
      {/* Rendu de toutes les images superposées pour un cross-fade parfait */}
      {imageUrls.map((url, index) => (
        <div 
          key={url}
          className="dynamic-bg-container"
          style={{
            backgroundImage: `url("${url}")`,
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out'
          }}
        />
      ))}
      
      {/* Filtre sombre (overlay) pour faire ressortir le texte */}
      <div className="dynamic-bg-overlay" />
    </>
  );
}