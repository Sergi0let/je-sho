"use client";
import { useEffect } from "react";

export default function Home() {
  // const [state, setState] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        return;
        const res = await fetch("/xml-data.json"); // немає http://localhost, бо ми вже на тому ж домені
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const json = await res.json(); // парсимо відповідь як JSON
        console.log(json);
        // setState(json);
      } catch (error) {
        console.error("Error fetching JSON:", error);
      }
    };

    fetchData();
  }, []);

  // console.log(state);
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        ROOT
      </main>
    </div>
  );
}
