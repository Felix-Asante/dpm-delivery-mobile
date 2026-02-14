import type { Query } from "@/types";

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const toQueryParams = (query: Query) => {
  const params = Object.entries(query)
    .map(([key, value]) => (value ? `${key}=${value}` : ""))
    .filter(Boolean)
    .join("&");

  return params ? `?${params}` : "";
};
