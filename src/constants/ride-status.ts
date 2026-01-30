import { ShipmentStatus } from "@/types/enums/shipment.enum";

export const riderUpdateStatusOptions = [
  {
    value: ShipmentStatus.PICKUP_CONFIRMED,
    label: "Pickup Confirmed",
    icon: "checkmark-circle" as const,
    description: "Package picked up from sender",
  },
  {
    value: ShipmentStatus.OUT_FOR_DELIVERY,
    label: "Out for Delivery",
    icon: "bicycle" as const,
    description: "Final delivery in progress",
  },
  {
    value: ShipmentStatus.REPACKAGED,
    label: "Repackaged",
    icon: "refresh" as const,
    description: "Package has been repackaged",
  },
  {
    value: ShipmentStatus.IN_TRANSIT,
    label: "In Transit",
    icon: "navigate" as const,
    description: "Package is on the way",
  },
  {
    value: ShipmentStatus.ARRIVED,
    label: "Arrived",
    icon: "location" as const,
    description: "Arrived at destination area",
  },

  {
    value: ShipmentStatus.DELIVERED,
    label: "Delivered",
    icon: "checkmark-done-circle" as const,
    description: "Successfully delivered to recipient",
  },
  {
    value: ShipmentStatus.FAILED_DELIVERY_ATTEMPT,
    label: "Failed Delivery",
    icon: "close-circle" as const,
    description: "Delivery attempt unsuccessful",
  },
  {
    value: ShipmentStatus.ON_HOLD,
    label: "On Hold",
    icon: "pause-circle" as const,
    description: "Delivery temporarily paused",
  },
];
