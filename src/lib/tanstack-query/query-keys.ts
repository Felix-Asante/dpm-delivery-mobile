export const queryKeys = {
  users: {
    wallet: () => ["users", "wallet"],
    riders: {
      stats: (riderId: string) => ["users", "riders", riderId, "stats"],
    },
  },
  shipments: {
    getRiderLatestOrders: (riderId: string) => [
      "shipments",
      "getRiderLatestOrders",
      riderId,
    ],
    getByReference: (reference: string) => [
      "shipments",
      "getByReference",
      reference,
    ],
  },
};
