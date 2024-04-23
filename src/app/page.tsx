"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [productList, setProductsList] = useState<any>([]);
  const [file, setFile] = useState<any>(null);
  const [temporaryImageURL, setTemporaryImagURL] = useState<any>();
  const [error, setError] = useState<string>("");

  function generateTemporaryUrl(file: any) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Invalid file or file type"));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event?.target?.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  const getProducts = async () => {
    try {
      const response = await fetch("/api/get-products");
      const resultantData = await response.json();
      setProductsList(resultantData?.data);
    } catch (err) {
      setError("Failed to get products, please try again");
    }
  };
  const handleFileChange = async (event: any) => {
    setFile(event.target.files[0]);
    const imageUrl = await generateTemporaryUrl(event.target.files[0]);
    setTemporaryImagURL(imageUrl);
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("url", temporaryImageURL);
      fetch("/api/search-product", {
        method: "POST",
        body: formData,
      }).then((res) => {
        console.log("res", res);
        setTemporaryImagURL(undefined);
        setFile("");
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  console.log("productList", productList);
  // return (
  //   <form onSubmit={handleFormSubmit}>
  //     <input
  //       type="file"
  //       accept="image/*"
  //       onChange={handleFileChange}
  //     />
  //     <button type="submit">Upload Image</button>
  //   </form>
  // );

  return (
    <div>
      <h1>Home Page</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleFormSubmit}>Upload Image</button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {[1, 2, 3, 4].map((image, index) => (
          <div
            key={index}
            style={{ width: "33.33%", padding: "5px" }}
          >
            {/* <img
              src={image}
              alt={`Image ${index}`}
              style={{ width: "100%", height: "auto" }}
            /> */}
            {image}
          </div>
        ))}
      </div>
    </div>
  );
}
