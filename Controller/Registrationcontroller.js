import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

/* ================= CREATE REGISTRATION ================= */
export const createRegistration = async (req, res) => {
  try {
    const { college, department, year, phone } = req.body;
    const eventId = req.params.eventId;

    if (!college || !department || !year || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await Registration.findOne({
      event: eventId,
      user: req.user._id,
    });

    if (existing) return res.status(400).json({ message: "Already registered" });

    // ✅ Create registration in collection
    const registration = await Registration.create({
      eventName: event.title,
      event: eventId,
      user: req.user._id,
      college,
      department,
      year,
      phone,
      status: "pending",
    });

    // ✅ Push same registration _id into embedded array
    event.registrations.push({
      _id: registration._id, // <--- IMPORTANT
      user: req.user._id,
      college,
      department,
      year,
      phone,
      status: "pending",
    });

    await event.save();

    res.status(201).json({
      message: "Registration submitted",
      registration, // return backend _id
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================= GET USER REGISTRATIONS ================= */
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event", "title date")
      .populate("user", "name email");

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL REGISTRATIONS (ADMIN) ================= */
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event", "title date")
      .populate("user", "name email");

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE STATUS (ADMIN) ================= */
export const updateRegistrationStatus = async (req, res) => {
  try {
    const status = req.path.includes("approve")
      ? "approved"
      : req.path.includes("reject")
      ? "rejected"
      : null;

    if (!status) return res.status(400).json({ message: "Invalid status" });

    // 🔥 Find event containing this embedded registration
    const event = await Event.findOne({ "registrations._id": req.params.id });
    if (!event)
      return res.status(404).json({ message: "Event not found for registration" });

    // 🔥 Find embedded registration
    const embeddedReg = event.registrations.id(req.params.id);
    if (!embeddedReg)
      return res.status(404).json({ message: "Embedded registration not found" });

    embeddedReg.status = status;
    await event.save();

    // 🔥 Update main registration collection
    const registration = await Registration.findById(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration record not found" });

    registration.status = status;
    await registration.save();

    res.json({ message: `Registration ${status}`, registration });
  } catch (err) {
    console.error("Approve/Reject Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================= DELETE REGISTRATION (ADMIN) ================= */
export const deleteRegistration = async (req, res) => {
  try {
    const event = await Event.findOne({ "registrations._id": req.params.id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const embeddedReg = event.registrations.id(req.params.id);
    if (!embeddedReg) return res.status(404).json({ message: "Registration not found" });

    await Registration.findByIdAndDelete(req.params.id);

    embeddedReg.remove();
    await event.save();

    res.json({ message: "Registration deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
