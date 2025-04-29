"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Trash } from "lucide-react";

interface Props {
  data: { name: string; updatedAt: string }[];
  onDelete: (name: string) => void;
}
const ListData = ({ data, onDelete }: Props) => {
  return (
    <div className="my-9 space-y-5 md:my-7">
      {data.map((item, index) => (
        <div
          className="flex items-center gap-4 rounded-sm bg-gray-100 p-2"
          key={index}
        >
          <div className="flex-1">
            <div className="mb-1 text-xs text-gray-400">
              {formatDate(item.updatedAt)}
            </div>
            <span className="text-xl">{item.name}</span>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => onDelete(item.name)}
          >
            <Trash />
            Видалити
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ListData;
