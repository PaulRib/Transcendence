import { useState, useEffect, useMemo, useRef } from 'react';
import { useGameUniverse } from '../context/GameUniverseContext';
import './DynamicBackground.css';

const leagueMedia = import.meta.glob('../assets/backgrounds/*.{png,jpg,jpeg,webp,webm}', { eager: true, query: '?url', import: 'default' });
const countryMedia = import.meta.glob('../assets/backgrounds_country/*.{png,jpg,jpeg,webp,webm}', { eager: true, query: '?url', import: 'default' });

type VideoBackgroundProps = {
  url: string;
  isActive: boolean;
  onEnded: () => void;
};

function VideoBackground({ url, isActive, onEnded }: VideoBackgroundProps) {
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
      muted
      playsInline
      preload="auto"
      onEnded={onEnded}
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
  const mediaUrls = useMemo(() => Object.values(media) as string[], [media]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const activeIndex = mediaUrls.length > 0 ? currentIndex % mediaUrls.length : 0;
  const activeUrl = mediaUrls[activeIndex];

  const goToNextMedia = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaUrls.length);
  };

  useEffect(() => {
    if (mediaUrls.length <= 1) return; // No rotation needed with 0 or 1 media item

    // Videos move to the next media item through their onEnded event.
    if (activeUrl.toLowerCase().includes('.webm')) return;

    // Keep the 10-second rotation for images.
    const timeoutId = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaUrls.length);
    }, 10000);

    return () => window.clearTimeout(timeoutId);
  }, [activeUrl, mediaUrls.length]);

  if (mediaUrls.length === 0) {
    return <div className="dynamic-bg-container bg-[#14141e]"></div>;
  }

  return (
    <>
      {/* Render all stacked media items for a clean cross-fade */}
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
            onEnded={goToNextMedia}
          />
        ) : (
          <div
            key={url}
            className="dynamic-bg-container"
            style={{ ...style, backgroundImage: `url("${url}")` }}
          />
        );
      })}
      
      {/* Dark overlay to make text stand out */}
      <div className="dynamic-bg-overlay" />
    </>
  );
}
