"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [productList, setProductsList] = useState<any>([]);
  const [file, setFile] = useState<any>(null);
  const [temporaryImageURL, setTemporaryImagURL] = useState<any>();
  const [error, setError] = useState<string>("");
  const [searchedProduct, setSearchedProduct] = useState<any>();
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
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

  const searchImageHandler = async (event: any) => {
    setSearchLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("url", temporaryImageURL);
      const response = await fetch("/api/search-product", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setSearchedProduct(result.product?.[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setSearchLoading(false);
      setFile("");
      setTemporaryImagURL(undefined);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", padding: 50, gap: 10 }}
    >
      <h1>Search By Image</h1>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            onClick={searchImageHandler}
            style={{
              display: "flex",
              border: "0.5px solid black",
              borderRadius: "5px",
            }}
          >
            Search
          </button>
        </div>
      </div>
      <h3>List of Products</h3>
      {searchedProduct ? (
        <div
          style={{
            display: "grid",
            flexDirection: "column",
            padding: 5,
            gap: 10,
            border: "1px solid black",
            borderRadius: "10px",
            width: "35%",
            placeContent: "center",
          }}
        >
          <div style={{ fontSize: "20px" }}>
            The searched image is similar to{" "}
            {searchedProduct?.name?.split(".")[0]}
          </div>
          <div
            style={{
              display: "grid",
              placeContent: "center",
              padding: 5,
              gap: 10,
            }}
          >
            <Image
              src={searchedProduct?.url}
              alt={"product-img"}
              width={250}
              height={400}
            />
          </div>
        </div>
      ) : searchLoading ? (
        <div>Loading...</div>
      ) : productList?.length ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            padding: 20,
            gap: 10,
            border: "0.5px solid black",
            borderRadius: "5px",
          }}
        >
          {productList?.map((product: any) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid black",
                borderRadius: "3px",
              }}
              key={product?._id}
            >
              <div
                key={product?._id}
                style={{
                  display: "grid",
                  placeContent: "center",
                  padding: 5,
                  borderBottom: "1px solid black",
                  gap: 10,
                }}
              >
                <Image
                  src={product?.url}
                  alt={"product-img"}
                  width={250}
                  height={400}
                />
              </div>
              <div style={{ padding: 10, background: "#FFE6D0" }}>
                {product?.name?.split(".")[0]}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
