import type { Wallet } from "./wallet.types";

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  phone: string;
  email?: any;
  fullName: string;
  address?: string | null;
  profilePicture?: string | null;
  isVerified: boolean;
  code?: string | null;
  codeUseCase?: string | null;
  codeExpiryDate: string;
  likes: string[];
  role: Role;
  adminFor?: null;
  wallet: Wallet | null;
  rider: RiderInfo;
  isDefaultPassword: boolean;
};

export type RiderInfo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  bikeRegistrationNumber: string;
  bikeType: string;
  bikeColor: string;
  bikeBrand: string;
  bikeModel: string;
  bikeYear: number;
  bikeImage: string;
  identificationDocumentNumber: string;
  identificationDocumentType: string;
  identificationDocumentImage: string;
  documentExpiryDate: string;
  riderId: string;
};

export type Role = {
  name: string;
  id: number;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
};

export type Rider = User & {
  rider: RiderInfo;
};
