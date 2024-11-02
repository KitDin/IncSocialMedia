import express from "express";
import { moderateContentController } from "../controllers/moderate.controller.js";
export const routerModerate = express.Router();

// export const routerModerate = express.Router();

routerModerate.route("/").post(moderateContentController);

// routerModerate.post("/moderate", async (req, res) => {
//   const text = req.body.text;

//   try {
//     const moderationResult = await moderateContentController.moderateText(text);
//     res.json(moderationResult);
//   } catch (error) {
//     console.error("Error moderating text:", error);
//     res.status(500).json({ error: "Failed to moderate text" });
//   }
// });
