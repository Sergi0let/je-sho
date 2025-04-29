"use client";

import FormProductGet from "@/components/forms/FormProductGet";
import ListData from "@/components/layouts/ListData";
import { useEffect, useState } from "react";

const Page = () => {
  const [listData, setListData] = useState<
    { name: string; updatedAt: string }[]
  >([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/get-xml-files");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setListData(data.files);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteData = async (slug: string) => {
    try {
      const response = await fetch(`/api/delete-xml-file`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: slug }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setListData((prev) => prev.filter((item) => item.name !== slug));
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4">
      <FormProductGet onSuccess={fetchData} />
      <ListData data={listData} onDelete={deleteData} />
    </main>
  );
};

export default Page;
