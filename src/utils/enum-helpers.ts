import { ShipmentOptions, ShipmentStatus } from "@/types/enums/shipment.enum";

export function getShipmentStatusDisplay(status: string, isAdmin?: boolean) {
  const statusDisplay: Record<string, string> = {
    [ShipmentStatus.OUT_FOR_DELIVERY]: "Out for Delivery",
    [ShipmentStatus.FAILED_DELIVERY_ATTEMPT]: "Failed Delivery Attempt",
    [ShipmentStatus.DELIVERED]: "Delivered",
    [ShipmentStatus.RIDER_REASSIGNED]: isAdmin
      ? "Rider Reassigned"
      : "Assigned",
    [ShipmentStatus.PICKUP_CONFIRMED]: "Pickup Confirmed",
    [ShipmentStatus.PENDING]: "Pending",
    [ShipmentStatus.RIDER_ASSIGNED]: isAdmin ? "Rider Assigned" : "Assigned",
    [ShipmentStatus.PAYMENT_RECEIVED]: "Payment Received",
    [ShipmentStatus.RETURNED]: "Returned",
    [ShipmentStatus.ON_HOLD]: "On Hold",
    [ShipmentStatus.REPACKAGED]: "Repackaged",
    [ShipmentStatus.IN_TRANSIT]: "In Transit",
    [ShipmentStatus.ARRIVED]: "Arrived",
    [ShipmentStatus.READY_FOR_PICKUP]: "Ready for Pickup",
    [ShipmentStatus.REFUNDED]: "Refunded",
  };

  return statusDisplay[status] ?? status;
}

export function getShipmentOptionDisplay(option: string) {
  if (option === ShipmentOptions.STANDARD) {
    return "Standard Delivery";
  } else if (option === ShipmentOptions.EXPRESS) {
    return "Express Delivery";
  } else if (option === ShipmentOptions.SPECIAL) {
    return "Special Delivery";
  } else if (option === ShipmentOptions.BULK) {
    return "Bulk Delivery";
  }
  return option;
}
