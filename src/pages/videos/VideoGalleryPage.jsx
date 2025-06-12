import React, { useEffect, useState, useContext } from 'react';
import { fetchVideos } from '../../api/content/videoApi';
import VideoCard from '../../components/videos/VideoCard';
import Pagination from '../../components/common/Pagination';
import { ThemeContext } from '../../contexts/ThemeContext';
import '../../styles/videos/VideoGalleryPage.css'; // Assuming you'll create this CSS file

const VideosGalleryPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { theme } = useContext(ThemeContext);

  const videosPerPage = 20;

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const response = await fetchVideos({ page: currentPage, limit: videosPerPage });
        setVideos(response.videos);
        setTotalPages(Math.ceil(response.totalCount / videosPerPage));
      } catch (error) {
        console.error('Error fetching videos:', error);
        // Optionally handle error display
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`video-gallery-page ${theme}`}>
      <h1>Video Gallery</h1>
      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} /> // Assuming video has a unique id
          ))}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default VideosGalleryPage;