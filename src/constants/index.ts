// ==================== FIELDS =============
interface FieldConfig {
  label: string;
  type: string;
  placeholder?: string;
}

export const FIELDS: Record<string, FieldConfig> = {
  name: { label: "Ім'я", type: "text", placeholder: "Ваше ім'я" },
  phone: { label: "Телефон", type: "tel", placeholder: "Телефон" },
  email: { label: "Email", type: "email", placeholder: "Ваша пошта" },
  raiting: { label: "Рейтинг", type: "select" },
  comment: {
    label: "Коментар",
    type: "textarea",
    placeholder: "Додаткові коментарі",
  },
};
// ==================== END FIELDS =============
