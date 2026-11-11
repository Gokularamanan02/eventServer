import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

/* ================= GET ALL EVENTS (PUBLIC) ================= */
export const getEvents = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const query = {};

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { venue: searchRegex },
        { category: searchRegex },
      ];
    }

    if (category && category !== "All" && category.trim() !== "") {
      query.category = new RegExp(`^${category.trim()}$`, "i");
    }

    let sortOptions = { date: 1 };
    if (sort === "desc") sortOptions = { date: -1 };
    if (sort === "created") sortOptions = { createdAt: -1 };

    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .populate("registrations.user", "name email")
      .sort(sortOptions);

    res.json(events);
  } catch (err) {
    console.error("getEvents error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

/* ================= GET EVENT BY ID (PUBLIC) ================= */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("registrations.user", "name email");

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (err) {
    console.error("getEventById error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

/* ================= CREATE EVENT (ADMIN) ================= */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      image,
      capacity,
      ticketPrice,
      tags,
    } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "Title, description, and date are required" });
    }

    const event = new Event({
      title: title.trim(),
      description: description.trim(),
      category: category || "Technical",
      date: new Date(date),
      time: time || "10:00 AM",
      venue: venue || "Main Campus Auditorium",
      image: image || "",
      capacity: capacity ? Number(capacity) : 100,
      ticketPrice: ticketPrice ? Number(ticketPrice) : 0,
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [],
      createdBy: req.user._id,
      registrations: [],
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("createEvent error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

/* ================= UPDATE EVENT (ADMIN) ================= */
export const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.date) updateData.date = new Date(updateData.date);
    if (typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map((t) => t.trim());
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Also update eventName in Registration collection if title changed
    if (updateData.title) {
      await Registration.updateMany(
        { event: event._id },
        { eventName: updateData.title }
      );
    }

    res.json(event);
  } catch (err) {
    console.error("updateEvent error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

/* ================= DELETE EVENT (ADMIN) ================= */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Clean up all registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    res.json({ message: "Event and associated registrations deleted successfully" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
