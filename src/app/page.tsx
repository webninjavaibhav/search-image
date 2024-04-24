"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ImageIcon from "../../public/images/image-icon.png";
import GridList from "./components/GridList";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";

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
      const imageUrl: any = await generateTemporaryUrl(event.target.files[0]);
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("url", imageUrl);
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
    <div className="flex flex-col p-[50px] gap-[10px]">
      <h1>Search By Image</h1>
      <div className="flex border border-[#f3b37c] rounded-[4px] w-full p-2">
        <input
          type="text"
          className="w-full rounded-md focus:outline-none focus:border-blue-500"
          placeholder="Search..."
        />
        <div>
          <label
            htmlFor="file-upload"
            className="custom-file-upload"
          >
            <Image
              src={ImageIcon}
              alt={"image-icon"}
              width={40}
              height={40}
            />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={searchImageHandler}
          />
        </div>
      </div>
      {searchedProduct ? (
        <div className="bg-white w-[400px] rounded-lg shadow-lg shadow-orange-300">
          <div className="relative h-[400px] p-[5px] gap-[10]">
            <Image
              src={searchedProduct?.url}
              objectFit="cover"
              alt={"product-img"}
              layout="fill"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-semibold text-center">
              The searched image is similar to{" "}
            </div>
            <div className="p-[10px] bg-[#f3b37c]">
              {searchedProduct?.name?.split(".")[0]}
            </div>
          </div>
        </div>
      ) : searchLoading ? (
        <div className="grid place-content-center h-[30vh]">
          <CircularProgress sx={{ color: "#f3b37c" }} />
        </div>
      ) : productList?.length ? (
        <div>
          <GridList>
            {productList?.map((product: any) => (
              <>
                <div
                  key={product?._id}
                  className="relative h-[400px] p-[5px] gap-[10]"
                >
                  <Image
                    src={product?.url}
                    objectFit="cover"
                    alt={"product-img"}
                    layout="fill"
                    className="object-cover"
                  />
                </div>
                <div className="p-[10px] bg-[#f3b37c]">
                  {product?.name?.split(".")[0]}
                </div>
              </>
            ))}
          </GridList>
        </div>
      ) : null}
    </div>
  );
}
