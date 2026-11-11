import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

/* ================= CREATE REGISTRATION ================= */
export const createRegistration = async (req, res) => {
  try {
    const college = (req.body.college || req.body.collegeName || "").trim();
    const phone = (req.body.phone || req.body.phoneNumber || "").trim();
    const department = (req.body.department || "").trim();
    const year = (req.body.year || req.body.yearOfStudy || "").trim();
    const eventId = req.params.eventId;

    if (!college || !phone) {
      return res.status(400).json({ success: false, message: "College name and phone number are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check capacity if set
    if (event.capacity && event.registrations && event.registrations.length >= event.capacity) {
      return res.status(400).json({ success: false, message: "Event capacity has been reached" });
    }

    // Check if user already registered for this event
    const existing = await Registration.findOne({
      event: eventId,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "You have already registered for this event" });
    }

    // Create registration in collection
    const registration = await Registration.create({
      eventName: event.title,
      event: eventId,
      user: req.user._id,
      college: college,
      department: department,
      year: year,
      phone: phone,
      status: "pending",
    });

    // Also push to embedded registrations on Event document
    if (!event.registrations) event.registrations = [];
    event.registrations.push({
      _id: registration._id,
      user: req.user._id,
      college: college,
      department: department,
      year: year,
      phone: phone,
      registeredAt: new Date(),
    });
    await event.save();

    res.status(201).json({
      success: true,
      message: "Successfully registered for event!",
      data: registration,
      registration,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================= GET USER'S REGISTRATIONS ================= */
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error("getMyRegistrations error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================= GET ALL REGISTRATIONS (ADMIN) ================= */
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event", "title date time venue category")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    console.error("getAllRegistrations error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================= UPDATE REGISTRATION STATUS (ADMIN) ================= */
export const updateRegistrationStatus = async (req, res) => {
  try {
    let status = req.body?.status;

    // Check if route is /:id/approve or /:id/reject
    if (req.path.includes("approve")) status = "approved";
    if (req.path.includes("reject")) status = "rejected";

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Valid status ('approved', 'rejected', or 'pending') is required" });
    }

    const regId = req.params.id;

    // Update in Registration collection
    const registration = await Registration.findById(regId);
    if (!registration) {
      return res.status(404).json({ message: "Registration record not found" });
    }

    registration.status = status;
    await registration.save();

    // Update in embedded Event registrations array
    await Event.updateOne(
      { "registrations._id": regId },
      { $set: { "registrations.$.status": status } }
    );

    res.json({
      success: true,
      message: `Registration marked as ${status}`,
      registration,
    });
  } catch (err) {
    console.error("Approve/Reject Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ================= DELETE REGISTRATION (ADMIN) ================= */
export const deleteRegistration = async (req, res) => {
  try {
    const regId = req.params.id;
    const registration = await Registration.findByIdAndDelete(regId);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Remove from event's embedded registrations array
    await Event.updateOne(
      { _id: registration.event },
      { $pull: { registrations: { _id: regId } } }
    );

    res.json({ success: true, message: "Registration deleted successfully" });
  } catch (err) {
    console.error("Delete registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
