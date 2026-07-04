import { useState, useEffect, useRef } from 'react';
import { useGameUniverse } from '../context/GameUniverseContext';
import './DynamicBackground.css';

const leagueMedia = import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg,webp,webm}', { eager: true, query: '?url', import: 'default' });
const countryMedia = import.meta.glob('../assets/backgrounds_country/*.{png,jpg,jpeg,webp,webm}', { eager: true, query: '?url', import: 'default' });

type VideoBackgroundProps = {
  url: string;
  isActive: boolean;
};

function VideoBackground({ url, isActive }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      void video.play();
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      className="dynamic-bg-container"
      src={url}
      loop
      muted
      playsInline
      preload="auto"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 1.5s ease-in-out'
      }}
    />
  );
}

export default function DynamicBackground() {
  const { universe } = useGameUniverse();
  const media = universe === 'league' ? leagueMedia : countryMedia;
  const mediaUrls = Object.values(media) as string[];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (mediaUrls.length <= 1) return; // Pas besoin de tourner s'il y a 0 ou 1 média

    // Changer toutes les 5 minutes (300 000 ms)
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaUrls.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [universe, mediaUrls.length]);

  if (mediaUrls.length === 0) {
    return <div className="dynamic-bg-container bg-[#14141e]"></div>;
  }

  const activeIndex = currentIndex % mediaUrls.length;

  return (
    <>
      {/* Rendu de tous les médias superposés pour un cross-fade parfait */}
      {mediaUrls.map((url, index) => {
        const isVideo = url.toLowerCase().includes('.webm');
        const style = {
          opacity: index === activeIndex ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out'
        };

        return isVideo ? (
          <VideoBackground
            key={url}
            url={url}
            isActive={index === activeIndex}
          />
        ) : (
          <div
            key={url}
            className="dynamic-bg-container"
            style={{ ...style, backgroundImage: `url("${url}")` }}
          />
        );
      })}
      
      {/* Filtre sombre (overlay) pour faire ressortir le texte */}
      <div className="dynamic-bg-overlay" />
    </>
  );
}
