// queue model for sending emails in diffrent templates

import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
    email: { type: String, required: true },
    template: { type: String, required: true },
    data: { type: Object, required: true },
    status: { type: String, required: true, enum: ["pending", "sent", "failed"], default: "pending" },
    sendAt: { type: Date, required: false, default: new Date() },
    error: { type: String, required: false, default: null },
    sentAt: { type: Date, required: false, default: null },
    failedAt: { type: Date, required: false, default: null },
}, 
{ timestamps: true });

const Templates = new mongoose.Schema({
    name: { type: String, required: true },
    template: {
        type: String, required: true, enum: [
            "feedback",
            "reminder",
            "appointment", 
            "payment", 
            "summary", 
            "facilityStatus", 
            "optimization", 
            "requests", 
            "activityLog",
        ]
    },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    html: { type: String, required: true },
    attachments: { type: [String], required: false },
}, { timestamps: true });

const QueueModel = mongoose.model("Queue", queueSchema);
const TemplatesModel = mongoose.model("Templates", Templates);

export { QueueModel, TemplatesModel };