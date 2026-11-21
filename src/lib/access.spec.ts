import { describe, expect, it } from "vitest";
import { canDeleteRecords, staffRole } from "./access";

describe("staffRole", () => {
  it("accepts the two clinic roles", () => {
    expect(staffRole("doctor")).toBe("doctor");
    expect(staffRole("secretary")).toBe("secretary");
  });

  it("rejects anything else", () => {
    expect(staffRole(undefined)).toBeNull();
    expect(staffRole("admin")).toBeNull();
    expect(staffRole({ role: "doctor" })).toBeNull();
  });
});

describe("canDeleteRecords", () => {
  it("allows delete only for the doctor", () => {
    expect(canDeleteRecords("doctor")).toBe(true);
    expect(canDeleteRecords("secretary")).toBe(false);
    expect(canDeleteRecords(null)).toBe(false);
  });
});
