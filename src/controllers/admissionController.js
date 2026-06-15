import { Admission } from "../models/Admission.js";
import {
  sendApplicantAutoReply,
  sendCollegeNotification,
} from "../services/emailService.js";

export async function createAdmission(req, res, next) {
  try {
    const application = await Admission.create({
      ...req.body,
      fullName: req.body.fullName.trim(),
      phone: req.body.phone.trim(),
      email: req.body.email.trim().toLowerCase(),
      dob: req.body.dob ? new Date(req.body.dob) : undefined,
      percentage:
        req.body.percentage === undefined || req.body.percentage === ""
          ? undefined
          : Number(req.body.percentage),
    });

    const emailResults = await Promise.allSettled([
      sendCollegeNotification(application),
      sendApplicantAutoReply(application),
    ]);

    const emailStatus = {
      college: emailResults[0].status === "fulfilled",
      applicant: emailResults[1].status === "fulfilled",
    };

    emailResults.forEach((result, index) => {
      if (result.status === "rejected") {
        const recipient = index === 0 ? "college" : "applicant";
        console.error(`Failed to send ${recipient} email:`, result.reason);
      }
    });

    return res.status(201).json({
      success: true,
      message: "Admission application received",
      applicationId: application._id,
      emailStatus,
    });
  } catch (error) {
    next(error);
  }
}
