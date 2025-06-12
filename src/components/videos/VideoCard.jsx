import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`video-card-container ${theme}`}>
      <div className="video-iframe-wrapper">
        <iframe
          src={video.url}
          title="Embedded Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoCard;