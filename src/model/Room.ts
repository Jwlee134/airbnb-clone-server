import mongoose, { Schema } from "mongoose";
import { IRoom } from "../types/room";

const RoomSchema: Schema = new mongoose.Schema({
  largeBuildingType: {
    label: String,
    description: String,
  },
  buildingType: {
    label: String,
    description: String,
  },
  roomType: String,
  isForGuest: String,
  maximumGuestCount: Number,
  bedroomCount: Number,
  bedCount: Number,
  bedType: [
    {
      id: Number,
      beds: [{ label: String, count: Number }],
    },
  ],
  publicBedType: [{ label: String, count: Number }],
  bathroomCount: Number,
  country: String,
  province: String,
  city: String,
  streetAddress: String,
  detailAddress: String,
  postalCode: String,
  latitude: Number,
  longitude: Number,
  amenities: [String],
  spaces: [String],
  photos: [String],
  description: String,
  title: String,
  forbiddenRules: [String],
  customRules: [String],
  availability: Number,
  blockedDayList: [String],
  price: Number,
  rating: {
    cleanliness: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    location: {
      type: Number,
      default: 0,
    },
    checkIn: {
      type: Number,
      default: 0,
    },
    satisfaction: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IRoom>("Room", RoomSchema);
