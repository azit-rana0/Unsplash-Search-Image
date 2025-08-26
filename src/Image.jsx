import axios from "axios";
import { useEffect, useState } from "react";
import throttle from "lodash.throttle";

const API_KEY = "GvJGBiRi3nK2Pem0BKP7BQQcPMuJRSI3AHWbGdAN9M8";

export default function Image({ searchTerm }) {
  console.log("Search term:", searchTerm);
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
    if (!searchTerm.trim()) return;
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    fetchImage(page === 1);
  }, [page, searchTerm]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    }, 500);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <>
      <div className="image-container">
        {images.length > 0 ? (
          images.map((img) => (
            <div key={img.id} className="item">
              <img src={img.urls.small} alt={img.alt_description || "Image"} />
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No Images Found
          </p>
        )}
      </div>
      <div className="more-button-container">
        <button
          className="more"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
        >
          More
        </button>
      </div>
    </>
  );
}
