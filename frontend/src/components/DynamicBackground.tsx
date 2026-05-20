import { useState, useEffect } from 'react';
import './DynamicBackground.css';

const images = import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' });
const imageUrls = Object.values(images) as string[];

export default function DynamicBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return; // Pas besoin de tourner s'il y a 0 ou 1 image

    // Changer toutes les 5 minutes (300 000 ms)
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  if (imageUrls.length === 0) {
    return <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, color: 'red', background: 'white', padding: '10px' }}>No background images found! Path might be wrong. images object: {JSON.stringify(images)}</div>;
  }

  return (
    <>
      {/* Container principal pour l'image de fond */}
      <div 
        className="dynamic-bg-container"
        style={{
          backgroundImage: `url("${imageUrls[currentIndex]}")`,
        }}
      />
      {/* Filtre sombre (overlay) pour faire ressortir le texte */}
      <div className="dynamic-bg-overlay" />
    </>
  );
}