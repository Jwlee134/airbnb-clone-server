import express from "express";

import { deleteFile, postFile } from "../controller/file";
import { getLocation } from "../controller/location";
import { postOauth } from "../controller/oauth";
import { getPlace } from "../controller/place";

import authRouter from "./authRouter";
import roomRouter from "./roomRouter";
import wishlistRouter from "./wishlistRouter";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/room", roomRouter);
router.use("/wishlist", wishlistRouter);

router.get("/location", getLocation);
router.get("/place", getPlace);

router.post("/oauth", postOauth);

router.route("/file").post(postFile).delete(deleteFile);

export default router;
