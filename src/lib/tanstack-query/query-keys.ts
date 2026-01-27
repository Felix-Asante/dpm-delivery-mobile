import type { Query } from "@/types";

export const queryKeys = {
  users: {
    wallet: () => ["users", "wallet"],
    riders: {
      stats: (riderId: string) => ["users", "riders", riderId, "stats"],
    },
  },
  shipments: {
    list: (query: Query) => ["shipments", "list", ...Object.entries(query)],
  },
};
