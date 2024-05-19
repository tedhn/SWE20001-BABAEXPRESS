import { format } from "date-fns";

export const formatDate: (date: Date | string, formatType: string) => string = (
  date,
  formatType
) => {
  return format(date, formatType);
};
