const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAdmission(req, res, next) {
  const errors = [];
  const { fullName, phone, email, percentage, dob } = req.body;

  if (typeof fullName !== "string" || !fullName.trim()) {
    errors.push({ field: "fullName", message: "Full name is required" });
  }

  if (typeof phone !== "string" || !phone.trim()) {
    errors.push({ field: "phone", message: "Phone is required" });
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    errors.push({ field: "email", message: "A valid email is required" });
  }

  if (
    percentage !== undefined &&
    percentage !== "" &&
    (!Number.isFinite(Number(percentage)) ||
      Number(percentage) < 0 ||
      Number(percentage) > 100)
  ) {
    errors.push({ field: "percentage", message: "Percentage must be between 0 and 100" });
  }

  if (dob && Number.isNaN(Date.parse(dob))) {
    errors.push({ field: "dob", message: "Date of birth is invalid" });
  }

  if (errors.length) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next();
}
