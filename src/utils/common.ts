import type { Query } from "@/types";

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

export const toQueryParams = (query: Query) => {
  const params = Object.entries(query)
    .map(([key, value]) => (value ? `${key}=${value}` : ""))
    .filter(Boolean)
    .join("&");

  return params ? `?${params}` : "";
};
