import axios from "axios";
import { useEffect, useState } from "react";

const API_KEY = "GvJGBiRi3nK2Pem0BKP7BQQcPMuJRSI3AHWbGdAN9M8";

export default function Image({ searchTerm }) {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchImage = async (newSearch = false) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: searchTerm,
            page: page,
            per_page: 20,
          },
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        }
      );

      const results = response.data.results;
      console.log("Fetched results:", results);

      if (newSearch) {
        setImages(results);
        setHasMore(results.length === 20);
      } else {
        setImages((prev) => [...prev, ...results]);
        setHasMore(results.length === 20);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
      fetchImage(true);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (page !== 1) {
      fetchImage();
    }
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div className="image-container">
      {images.length > 0 ? (
        images.map((img) => (
          <div className="item">
            <img
              key={img.id}
              src={img.urls.small}
              alt={img.alt_description || "Image"}
            />
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No Images Found
        </p>
      )}
    </div>
  );
}
