import { Document } from "mongoose";
import { IReview, IRoomDetail } from "./room";

interface ReservationForm {
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  birthday: Date;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isLoggedIn: boolean;
  rooms: IRoomDetail["_id"];
  review: IReview["_id"];
  wishlist: IWishlist["_id"];
  reservationRequest: ReservationForm[];
}

export interface IWishlist extends Document {
  title: string;
  list: IRoomDetail["_id"];
  creator: IUser["_id"];
  createdAt: Date;
}
