import { useState } from "react";
import Header from "./Header";
import Image from "./Image";
import Footer from "./Footer";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("nature"); // default search term

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Image searchTerm={searchTerm} />
      <Footer />
    </>
  );
}
