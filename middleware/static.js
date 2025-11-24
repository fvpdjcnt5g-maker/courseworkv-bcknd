import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ../static folder
const staticPath = path.join(__dirname, "..", "static");

export default express.static(staticPath);
