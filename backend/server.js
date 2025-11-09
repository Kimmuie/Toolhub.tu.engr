import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_URI);

const borrowSchema = new mongoose.Schema({
  username: String,
  password: String,
  pickupDate: String,
  pickupTime: String,
  returnDate: String,
  selectedTools: Array,
});

const Borrow = mongoose.model("Borrow", borrowSchema);

app.post("/api/borrow", async (req, res) => {
  try {
    const borrow = new Borrow(req.body);
    await borrow.save();
    res.status(201).json({ message: "Saved to database!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});
