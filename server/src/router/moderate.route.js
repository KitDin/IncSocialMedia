import express from "express";
import { moderateContentController } from "../controllers/moderate.controller.js";

export const routerModerate = express.Router();

routerModerate.route("/").post(moderateContentController);
