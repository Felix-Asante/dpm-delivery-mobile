import { ShipmentStatus } from "@/types/enums/shipment.enum";

export function getStatusColor(status: string) {
  switch (status) {
    case ShipmentStatus.OUT_FOR_DELIVERY:
    case ShipmentStatus.IN_TRANSIT:
    case ShipmentStatus.RIDER_ASSIGNED:
      return "bg-accent/10";
    case ShipmentStatus.DELIVERED:
    case ShipmentStatus.PAYMENT_RECEIVED:
      return "bg-green-100/10";
    case ShipmentStatus.PENDING:
    case ShipmentStatus.READY_FOR_PICKUP:
      return "bg-yellow-100/10";
    case ShipmentStatus.PICKUP_CONFIRMED:
    case ShipmentStatus.ARRIVED:
      return "bg-blue-100/10";
    case ShipmentStatus.FAILED_DELIVERY_ATTEMPT:
    case ShipmentStatus.ON_HOLD:
      return "bg-red-100/10";
    case ShipmentStatus.RETURNED:
    case ShipmentStatus.REFUNDED:
      return "bg-orange-100/10";
    case ShipmentStatus.RIDER_REASSIGNED:
    case ShipmentStatus.REPACKAGED:
      return "bg-purple-100/10";
    default:
      return "bg-gray-100";
  }
}

export function getStatusTextColor(status: string) {
  switch (status) {
    case ShipmentStatus.OUT_FOR_DELIVERY:
    case ShipmentStatus.IN_TRANSIT:
    case ShipmentStatus.RIDER_ASSIGNED:
      return "text-accent";
    case ShipmentStatus.DELIVERED:
    case ShipmentStatus.PAYMENT_RECEIVED:
      return "text-green-600";
    case ShipmentStatus.PENDING:
    case ShipmentStatus.READY_FOR_PICKUP:
      return "text-yellow-600";
    case ShipmentStatus.PICKUP_CONFIRMED:
    case ShipmentStatus.ARRIVED:
      return "text-blue-600";
    case ShipmentStatus.FAILED_DELIVERY_ATTEMPT:
    case ShipmentStatus.ON_HOLD:
      return "text-red-600";
    case ShipmentStatus.RETURNED:
    case ShipmentStatus.REFUNDED:
      return "text-orange-600";
    case ShipmentStatus.RIDER_REASSIGNED:
    case ShipmentStatus.REPACKAGED:
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
}
