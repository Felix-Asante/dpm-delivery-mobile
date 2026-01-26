export const queryKeys = {
  users: {
    wallet: () => ["users", "wallet"],
    riders: {
      stats: (riderId: string) => ["users", "riders", riderId, "stats"],
    },
  },
};
