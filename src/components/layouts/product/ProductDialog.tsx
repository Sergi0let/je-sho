"use client";

import { useResponses } from "@/components/context/ResponsesContext";
import Checkicon from "@/components/icons/Checkicon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendUserdata } from "@/lib/sendUserdata";
import { cn } from "@/lib/utils";
import { purchaseSchema, reviewSchema } from "@/lib/validations";
import { IOrderData, IResponsesData } from "@/types";
import { useRouter } from "next/navigation";
import { ReactNode, useId, useState } from "react";
import ProductForm from "./ProductForm";
import ProductPreview from "./ProductPreview";

const ProductModalThanks = ({ message }: { message: string }) => {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <Checkicon className="size-16" />
      </div>
      <DialogTitle className="text-center text-2xl font-semibold">
        {message}
      </DialogTitle>
      <DialogDescription className="font-base px-6 text-center">
        Ми цінуємо ваш внесок.
      </DialogDescription>
    </>
  );
};

interface Props {
  title: string;
  backdropClass?: string;
  className?: string;
  isPreview?: boolean;
  icon?: ReactNode;
  productData?: IOrderData;
  isRespond?: boolean;
}

const ProductDialog = ({
  className,
  title,
  icon,
  backdropClass,
  productData,
  isPreview = false,
  isRespond = false,
}: Props) => {
  const router = useRouter();
  const customId = useId();
  const [isGreat, setIsGreat] = useState(false);
  const { addResponse } = useResponses();

  const handleSaveComment = (data: {
    name: string;
    comment: string;
    raiting: string;
  }) => {
    try {
      const newReview: IResponsesData = {
        id: customId,
        date: new Date().toISOString(),
        name: data.name,
        respond: data.comment,
        raiting: data.raiting,
      };
      console.log(newReview);
      addResponse(newReview);
      setIsGreat(true);
      router.refresh();
      return { success: true };
    } catch (error) {
      console.log("Error:", error);
      return { success: false };
    }
  };

  const handlePurchase = () => {
    setIsGreat(true);
    router.push("?thankYou=1");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={className}>
          {icon && icon}
          <span
            className={cn("font-semibold text-nowrap uppercase", {
              "ml-2": icon,
            })}
          >
            {title}
          </span>
        </button>
      </DialogTrigger>
      <DialogOverlay className={backdropClass} />
      <DialogContent className="dialog-content !w-full rounded-2xl border-none p-8 md:max-w-md">
        <DialogHeader>
          {isGreat ? (
            <ProductModalThanks
              message={
                isRespond
                  ? "Дякуємо! Відгук прийнято"
                  : "Дякуємо! Замовлення прийнято"
              }
            />
          ) : isRespond ? (
            <>
              <DialogTitle className="text-center text-2xl font-semibold">
                Залиште свій відгук
              </DialogTitle>
              <DialogDescription className="font-base px-6 text-center">
                Ваш відгук важливий для нас. Будь ласка, залиште свій коментар.
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="text-center text-2xl font-semibold">
                {`${title} товар`}
              </DialogTitle>
              <DialogDescription className="font-base px-6 text-center">
                Залиште своє ім’я та номер телефону, і ми зателефонуємо вам для
                оформлення замовлення
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        <div className="flex flex-col space-x-2">
          {isPreview && productData && !isRespond && !isGreat && (
            <ProductPreview
              className="mb-4 flex border-t border-b py-4 text-center"
              {...productData}
              isPreview={true}
            />
          )}
          <div className="grid flex-1 gap-2">
            {isRespond && !isGreat ? (
              <ProductForm
                schema={reviewSchema}
                defaultValues={{ name: "", comment: "", raiting: "5" }}
                onSubmit={handleSaveComment}
              />
            ) : !isGreat ? (
              <ProductForm
                defaultValues={{ name: "", phone: "", email: "" }}
                type="BUYER_DATA"
                onSubmit={sendUserdata}
                handleGreat={handlePurchase}
                schema={purchaseSchema}
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
