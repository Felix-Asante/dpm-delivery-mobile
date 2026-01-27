import type { PaginationMeta } from "@/types";
import type { Rider } from "./auth.types";

export type GetShipmentsResponse = {
  meta: PaginationMeta;
  items: Shipment[];
};

export type Shipment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  pickupCity: string;
  pickupArea: string;
  senderPhone: string;
  pickupDate: any;
  dropOffCity: string;
  dropOffArea: string;
  recipientPhone: string;
  dropOffDate: any;
  extraInformation: string | null;
  shipmentOption: string;
  modeOfShipment: string;
  status: string;
  reference: string;
  rider: Rider | null;
  history: ShipmentHistory[];
  shipmentCost: ShipmentCost | null;
};

export type ShipmentCost = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  pickupFee: number;
  deliveryFee: number;
  riderCommission: number;
  repackagingFee: number;
  paid: boolean;
  includeRepackagingFee: boolean;
  paidAt: string;
  totalCost: number;
};

export type ShipmentHistory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  status: string;
  description: any;
  data: HistoryData;
};

export type HistoryData = Record<string, any>;
