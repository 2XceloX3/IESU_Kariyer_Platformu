import React, { useState, useEffect } from 'react';

const NewsPage = ({ fetchNews }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = async () => {
    try {
      setLoading(true);
      const dataList = await fetchNews();
      const news = dataList.map(data => {
        return {
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
          publishedAt: data.publishedAt ? new Date(data.publishedAt.seconds * 1000).toISOString() : new Date().toISOString(),
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
        };
      });

      setNewsList(news);
    } catch (err) {
      console.error("[NewsPage] Haberler yüklenirken hata:", err);
      setError("Haberler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchNews) {
      loadNews();
    } else {
      setLoading(false);
    }
  }, [fetchNews]);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div data-testid="loading-state">Yükleniyor...</div>;
  if (error) return <div role="alert" data-testid="error-message">{error}</div>;

  return (
    <div>
      <h1>Haberler</h1>
      <ul data-testid="news-list">
        {newsList.map((newsItem, index) => (
          <li key={index} data-testid="news-item">
            <h2>{newsItem.title}</h2>
            <img src={newsItem.imageUrl} alt={newsItem.title} />
            <p>Created: {formatDate(newsItem.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPage;
