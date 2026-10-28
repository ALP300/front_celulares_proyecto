"use client";
import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => text.split("-").join(" ");

const ShopContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  return (
    <div className="text-black bg-white">
      <div className=" max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <Breadcrumb />
        <div className="grid grid-cols-[200px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-5">
          <Filters />
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5">
              <h2 className="text-2xl font-bold max-sm:text-xl max-[400px]:text-lg uppercase">
                {category ? sanitize(improveCategoryText(category)) : "All products"}
              </h2>

              <SortBy />
            </div>
            <div className="divider"></div>
            <Products />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
