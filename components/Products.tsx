// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Products />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";

const Products = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const inStockNum = searchParams.get("inStock") === "true" ? 1 : 0;
  const outOfStockNum = searchParams.get("outOfStock") === "true" ? 1 : 0;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const price = searchParams.get("price") || 3000;
  const rating = Number(searchParams.get("rating")) || 0;
  const sort = searchParams.get("sort");

  let stockMode: string = "lte";
  if (inStockNum === 1) stockMode = "equals";
  if (outOfStockNum === 1) stockMode = "lt";
  if (inStockNum === 1 && outOfStockNum === 1) stockMode = "lte";
  if (inStockNum === 0 && outOfStockNum === 0) stockMode = "gt";

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // sending API request with filtering, sorting and pagination for getting all products
    const url = `/api/products?filters[price][$lte]=${price}&filters[rating][$gte]=${rating}&filters[inStock][$${stockMode}]=1&${
      category ? `filters[category][$equals]=${category}&` : ""
    }sort=${sort}&page=${page}`;

    apiClient
      .get(url)
      .then((res) => (res.ok ? res.json() : []))
      .then((result) => setProducts(Array.isArray(result) ? result : []))
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, [category, price, rating, stockMode, sort, page]);

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;
