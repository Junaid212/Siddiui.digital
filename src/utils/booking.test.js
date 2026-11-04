import test from "node:test";
import assert from "node:assert/strict";
import { to24Hour, isDateDisabled, isSlotInPast, validateBookingForm, TIME_SLOTS } from "./booking.js";

test("converts display times to 24-hour values", () => {
  assert.equal(to24Hour("9:00 AM"), "09:00");
  assert.equal(to24Hour("12:00 PM"), "12:00");
  assert.equal(to24Hour("7:00 PM"), "19:00");
});

test("disables past dates and Saturdays", () => {
  const saturday = new Date(2026, 9, 31);
  assert.equal(saturday.getDay(), 6);
  assert.equal(isDateDisabled(saturday), true);
  assert.equal(isDateDisabled(null), true);
});

test("marks elapsed times on a previous day as past", () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  assert.equal(isSlotInPast(yesterday, "9:00 AM"), true);
});

test("accepts formatted international phone numbers", () => {
  const errors = validateBookingForm({
    name: "Audit Tester",
    email: "audit-booking-oct30-2026@siddiqui.digital",
    phone: "+971 50 123 4567",
  });
  assert.deepEqual(errors, {});
});

test("rejects invalid customer details", () => {
  const errors = validateBookingForm({
    name: " ",
    email: "bad",
    phone: "12",
  });
  assert.equal(Boolean(errors.name), true);
  assert.equal(Boolean(errors.email), true);
  assert.equal(Boolean(errors.phone), true);
});

test("keeps morning, afternoon, and evening slots aligned", () => {
  assert.ok(TIME_SLOTS.morning.includes("11:30 AM"));
  assert.ok(TIME_SLOTS.afternoon.includes("12:00 PM"));
  assert.ok(TIME_SLOTS.evening.includes("7:00 PM"));
});
