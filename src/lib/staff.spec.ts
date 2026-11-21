import { describe, expect, it } from "vitest";
import { staffEmail } from "./staff";

describe("staffEmail", () => {
  it("maps the doctor and the secretary to their private mailboxes", () => {
    expect(staffEmail("فاطمة")).toBe("doctor@obgyn.clinic");
    expect(staffEmail("  دكتورة  ")).toBe("doctor@obgyn.clinic");
    expect(staffEmail("مساعدة")).toBe("helper@obgyn.clinic");
    expect(staffEmail("سكرتيرة")).toBe("helper@obgyn.clinic");
  });

  it("rejects an unknown name", () => {
    expect(staffEmail("")).toBeNull();
    expect(staffEmail("ليلى")).toBeNull();
    expect(staffEmail("admin")).toBeNull();
  });
});
