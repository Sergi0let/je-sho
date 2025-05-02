import { z } from "zod";

// export const buyerLeaveDataSchema = z.object({
//   name: z
//     .string()
//     .min(3, { message: "Ім'я повинно містити щонайменше 3 символи" }),
//   phone: z
//     .string()
//     .regex(/^\+38 \(0\d{2}\) \d{3} \d{2} \d{2}$/, "Невірний формат номера"),
//   email: z.string().email("Введіть коректну електронну адресу"),
// });

export const purchaseSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Ім'я повинно містити щонайменше 3 символи" }),
  phone: z
    .string()
    .min(10, { message: "Телефон повинен містити щонайменше 10 символів" }),
  email: z.string().email({ message: "Невірний формат email" }),
  comment: z.string().optional(),
});

export const reviewSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Ім'я повинно містити щонайменше 3 символи" }),
  comment: z
    .string()
    .min(12, { message: "Коментар повинен бути щонайменше 12 символів" }),
  raiting: z.string(),
});
