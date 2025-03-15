const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Improved MongoDB Connection with Detailed Error Logs
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Disaster Schema
const DisasterSchema = new mongoose.Schema({
    type: String,
    location: String,
    severity: Number,
    timestamp: { type: Date, default: Date.now }
});
const Disaster = mongoose.model("Disaster", DisasterSchema);

// ✅ API: Get All Disasters
app.get("/disasters", async (req, res) => {
    try {
        const disasters = await Disaster.find().sort({ timestamp: -1 });
        res.send(disasters);
    } catch (error) {
        console.error("Error fetching disasters:", error);
        res.status(500).send("Error fetching disasters.");
    }
});

// ✅ API: Report a Disaster
app.post("/disasters", async (req, res) => {
    try {
        const { type, location, severity } = req.body;
        const disaster = new Disaster({ type, location, severity });
        await disaster.save();
        res.send("Disaster reported successfully!");
    } catch (error) {
        console.error("Error saving disaster:", error);
        res.status(500).send("Error saving disaster.");
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
