import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

/* ================= CREATE REGISTRATION (USER) ================= */
export const createRegistration = async (req, res) => {
  try {
    const { college, department, year, phone, eventName } = req.body;
    const eventId = req.params.eventId;

    // ✅ Validate required fields
    if (!college || !phone || !eventName) {
      return res.status(400).json({
        message: "College, phone, and eventName are required",
      });
    }

    // Find event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user already registered
    const existing = await Registration.findOne({
      event: eventId,
      user: req.user._id,
    });
    if (existing)
      return res.status(400).json({ message: "Already registered" });

    // Create registration in Registration collection
    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
      college,
      department,
      year,
      phone,
      status: "pending",
    });

    // Push registration into Event document
    event.registrations.push({
      user: req.user._id,
      college,
      department,
      year,
      phone,
      status: "pending",
    });
    await event.save();

    res.status(201).json({
      message: "Registration submitted successfully",
      registration,
    });
  } catch (err) {
    console.error("createRegistration error:", err);
    res.status(500).json({ message: "Internal Server Error" });
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
    console.error("getMyRegistrations error:", err);
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
    console.error("getAllRegistrations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE REGISTRATION STATUS (ADMIN) ================= */
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const registration = await Registration.findById(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    registration.status = status;
    await registration.save();

    // Update Event document registration
    const event = await Event.findById(registration.event);
    if (event) {
      const regInEvent = event.registrations.find(
        (r) => r.user.toString() === registration.user.toString()
      );
      if (regInEvent) regInEvent.status = status;
      await event.save();
    }

    res.json({ message: "Registration status updated", registration });
  } catch (err) {
    console.error("updateRegistrationStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE REGISTRATION (ADMIN) ================= */
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    await registration.deleteOne();

    // Remove registration from Event document
    const event = await Event.findById(registration.event);
    if (event) {
      event.registrations = event.registrations.filter(
        (r) => r.user.toString() !== registration.user.toString()
      );
      await event.save();
    }

    res.json({ message: "Registration deleted successfully" });
  } catch (err) {
    console.error("deleteRegistration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL EVENTS ================= */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("registrations.user", "name email");

    res.json(events);
  } catch (err) {
    console.error("getEvents error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= GET EVENT BY ID ================= */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("registrations.user", "name email");

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (err) {
    console.error("getEventById error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= CREATE EVENT (ADMIN) ================= */
export const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id,
      registrations: [],
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= UPDATE EVENT (ADMIN) ================= */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (err) {
    console.error("updateEvent error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= DELETE EVENT (ADMIN) ================= */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
