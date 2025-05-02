"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FIELDS } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  type?: "BUYER_DATA";
  handleGreat?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: T) => any;
}

const ProductForm = <T extends FieldValues>({
  schema,
  defaultValues,
  handleGreat,
  onSubmit,
}: Props<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const PREFIX = "+38 (0";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // Format phone number to ensure it has the correct format with parentheses
  const formatPhoneNumber = (value: string): string => {
    // If empty, return empty string (for placeholder to show)
    if (!value || value === "") {
      return "";
    }

    // If just the prefix, return the prefix
    if (value === PREFIX) {
      return PREFIX;
    }

    // Extract all digits from the input
    const allDigits = value.replace(/[^0-9]/g, "");

    // Handle potential duplication of "380"
    let digits = allDigits;
    if (allDigits.startsWith("380")) {
      digits = allDigits.substring(3);
    }

    // Format the phone number with the new pattern
    if (digits.length <= 2) {
      // Just the operator code (partial)
      return `+38 (0${digits}`;
    } else if (digits.length <= 5) {
      // Operator code complete, starting area code
      return `+38 (0${digits.substring(0, 2)}) ${digits.substring(2)}`;
    } else if (digits.length <= 7) {
      // Area code complete, starting subscriber number
      return `+38 (0${digits.substring(0, 2)}) ${digits.substring(2, 5)} ${digits.substring(5)}`;
    } else {
      // Full number with proper spacing
      return `+38 (0${digits.substring(0, 2)}) ${digits.substring(2, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
    }
  };

  // Handle phone input changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // If we're deleting and at the prefix, don't format
    if (
      isDeleting &&
      (rawValue === PREFIX || rawValue.length <= PREFIX.length)
    ) {
      setPhoneValue(PREFIX);
      form.setValue("phone" as Path<T>, PREFIX as never);
      return;
    }

    const formattedValue = formatPhoneNumber(rawValue);
    setPhoneValue(formattedValue);
    form.setValue("phone" as Path<T>, formattedValue as never);
  };

  // Handle key down events to detect deletion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Track if we're deleting
    setIsDeleting(e.key === "Backspace" || e.key === "Delete");

    // If field is empty and user presses a digit, add the prefix
    if (/^\d$/.test(e.key) && (!phoneValue || phoneValue === "")) {
      setPhoneValue(PREFIX);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.value = PREFIX + e.key;
          const event = new Event("input", { bubbles: true });
          inputRef.current.dispatchEvent(event);
        }
      }, 0);
    }

    // Prevent deleting the prefix when it's present
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      phoneValue.startsWith(PREFIX) &&
      inputRef.current &&
      (inputRef.current.selectionStart || 0) <= PREFIX.length
    ) {
      e.preventDefault();
    }

    // Allow only digits, arrows, tab, backspace, delete
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    if (
      !allowedKeys.includes(e.key) &&
      !/^\d$/.test(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
    }
  };

  // Handle focus to ensure prefix and cursor position
  const handleFocus = () => {
    setIsFocused(true);

    if (inputRef.current) {
      // If empty, set to prefix
      if (!phoneValue || phoneValue === "") {
        setPhoneValue(PREFIX);
        form.setValue("phone" as Path<T>, PREFIX as never);
      }

      // Position cursor after prefix if at the beginning
      const cursorPos = inputRef.current.selectionStart || 0;
      if (cursorPos < PREFIX.length && phoneValue.startsWith(PREFIX)) {
        setTimeout(() => {
          inputRef.current?.setSelectionRange(PREFIX.length, PREFIX.length);
        }, 10);
      }
    }
  };

  // Handle blur event
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldOnBlur: any,
  ) => {
    setIsFocused(false);

    // If only prefix is entered, clear the field to show placeholder
    if (phoneValue === PREFIX) {
      setPhoneValue("");
      form.setValue("phone" as Path<T>, "" as never);
    }

    // Call the original onBlur
    fieldOnBlur(e);
  };

  // Handle click to prevent cursor before prefix
  const handleClick = () => {
    if (inputRef.current && phoneValue.startsWith(PREFIX)) {
      const cursorPos = inputRef.current.selectionStart || 0;
      if (cursorPos < PREFIX.length) {
        inputRef.current.setSelectionRange(PREFIX.length, PREFIX.length);
      }
    }
  };

  // Initialize phone value
  useEffect(() => {
    // Set initial phone value from form
    const initialPhone = form.getValues("phone" as Path<T>) as string;

    // Only format if it's not empty
    if (initialPhone && initialPhone !== "") {
      const formattedValue = formatPhoneNumber(initialPhone);
      setPhoneValue(formattedValue);
      form.setValue("phone" as Path<T>, formattedValue as never);
    }
  }, [form]);

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      setIsSubmitting(true);

      const res = await onSubmit(data);

      if (res.success) {
        form.reset();
        setPhoneValue("");
        if (handleGreat) {
          handleGreat();
        }
        // toast.success("Успішно відправлено");
      }

      return res;
    } catch (error) {
      console.error(error);
      // toast.error("Щось пішло не так, спробуйте ще раз");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 md:space-y-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {FIELDS[field.name as keyof typeof FIELDS]?.label ||
                    field.name}
                </FormLabel>
                <FormControl>
                  {field.name === "phone" ? (
                    <Input
                      placeholder="+38 (0__) ___ __ __"
                      ref={(el) => {
                        inputRef.current = el;
                        field.ref(el);
                      }}
                      name={field.name}
                      onChange={handlePhoneChange}
                      onKeyDown={handleKeyDown}
                      onFocus={handleFocus}
                      onClick={handleClick}
                      onBlur={(e) => handleBlur(e, field.onBlur)}
                      value={phoneValue}
                      className="h-12 border-[#C4E8F9] text-base ring-0 focus-visible:border-blue-400 focus-visible:ring-blue-50"
                      type="tel"
                      required
                      maxLength={19}
                    />
                  ) : field.name === "comment" ? (
                    <Textarea
                      className="h-24 w-full border-[#C4E8F9] text-base ring-0 focus-visible:border-blue-400 focus-visible:ring-blue-50"
                      {...field}
                    />
                  ) : field.name === "raiting" ? (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        type="button"
                        className="h-12 border-[#C4E8F9] text-base ring-0 focus-visible:border-blue-400 focus-visible:ring-blue-50"
                      >
                        <SelectValue placeholder="Залиште оцінку" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Оцінки</SelectLabel>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="h-12 border-[#C4E8F9] text-base ring-0 focus-visible:border-blue-400 focus-visible:ring-blue-50"
                      required
                      type={
                        FIELDS[field.name as keyof typeof FIELDS]?.type ||
                        "text"
                      }
                      placeholder={
                        FIELDS[field.name as keyof typeof FIELDS]
                          ?.placeholder || ""
                      }
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "bg-green-main flex w-full cursor-pointer items-center justify-center rounded-lg px-8 py-4 text-white transition-opacity hover:opacity-80 disabled:bg-blue-400",
          )}
        >
          <span className="font-semibold uppercase">
            {isSubmitting ? "Відправляю..." : "Замовити"}
          </span>
        </button>
      </form>
    </Form>
  );
};

export default ProductForm;
