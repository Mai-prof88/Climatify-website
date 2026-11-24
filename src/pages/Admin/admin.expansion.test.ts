import { describe, it, expect, beforeEach } from "vitest";
import { useCMSStore } from "../../store/useCMSStore";
import { apiService } from "../../services/api";

describe("Admin Expansion & CMS Store Actions", () => {
  beforeEach(() => {
    useCMSStore.setState({
      users: [],
      eventRegistrations: [],
      formSubmissions: [],
      events: [],
      posts: [],
      programs: [],
      initiatives: [],
      courses: [],
      opportunities: [],
      team: [],
      messages: [],
      stats: null,
      analytics: [],
      siteSettings: { siteName: "Climatify", contactEmail: "info@climatify-youth.com", enableMaintenance: false },
      loading: false,
      error: null,
      failedResources: []
    });
  });

  describe("Admin Users & Membership Management", () => {
    it("loads users and correctly populates state", async () => {
      await useCMSStore.getState().loadAdminUsers();
      const users = useCMSStore.getState().users;
      expect(users.length).toBeGreaterThan(0);
      const first = users[0];
      if (!first) throw new Error("Expected at least one user");
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("email");
      expect(first).toHaveProperty("role");
      expect(first).toHaveProperty("status");
    });

    it("creates a new admin user and appends to state", async () => {
      await useCMSStore.getState().loadAdminUsers();
      const countBefore = useCMSStore.getState().users.length;

      const res = await useCMSStore.getState().createAdminUser({
        name: "Test Green Officer",
        email: `green-officer-${Date.now()}@climatify-youth.com`,
        city: "دبي",
        bio: "عضو قيادي في العمل المناخي والتمكين الشبابي",
        role: "admin",
        status: "active"
      });

      expect(res.ok).toBe(true);
      expect(useCMSStore.getState().users.length).toBe(countBefore + 1);
      const created = useCMSStore.getState().users[0];
      if (!created) throw new Error("Expected created user");
      expect(created.name).toBe("Test Green Officer");
      expect(created.role).toBe("admin");
    });

    it("updates user role", async () => {
      await useCMSStore.getState().loadAdminUsers();
      const user = useCMSStore.getState().users[0];
      if (!user) throw new Error("Expected user");

      const newRole = user.role === "admin" ? "member" : "admin";
      await useCMSStore.getState().updateAdminUserRole(user.id, newRole);

      const updated = useCMSStore.getState().users.find((u) => u.id === user.id);
      expect(updated?.role).toBe(newRole);
    });

    it("toggles user status between active and suspended", async () => {
      await useCMSStore.getState().loadAdminUsers();
      const user = useCMSStore.getState().users[0];
      if (!user) throw new Error("Expected user");
      const initialStatus = user.status;

      await useCMSStore.getState().toggleAdminUserStatus(user.id);
      const afterFirstToggle = useCMSStore.getState().users.find((u) => u.id === user.id);
      expect(afterFirstToggle?.status).toBe(initialStatus === "active" ? "suspended" : "active");

      await useCMSStore.getState().toggleAdminUserStatus(user.id);
      const afterSecondToggle = useCMSStore.getState().users.find((u) => u.id === user.id);
      expect(afterSecondToggle?.status).toBe(initialStatus);
    });

    it("deletes a user from state", async () => {
      await useCMSStore.getState().loadAdminUsers();
      const users = useCMSStore.getState().users;
      const targetUser = users[0];
      if (!targetUser) throw new Error("Expected user");
      const countBefore = users.length;

      await useCMSStore.getState().deleteAdminUser(targetUser.id);
      const usersAfter = useCMSStore.getState().users;
      expect(usersAfter.length).toBe(countBefore - 1);
      expect(usersAfter.some((u) => u.id === targetUser.id)).toBe(false);
    });
  });

  describe("Admin Event Registrations Hub", () => {
    it("loads event registrations successfully", async () => {
      await useCMSStore.getState().loadAdminEventRegistrations();
      const registrations = useCMSStore.getState().eventRegistrations;
      expect(registrations.length).toBeGreaterThan(0);
      const first = registrations[0];
      if (!first) throw new Error("Expected registration");
      expect(first).toHaveProperty("eventId");
      expect(first).toHaveProperty("name");
      expect(first).toHaveProperty("email");
      expect(first).toHaveProperty("status");
    });

    it("updates registration status to attended or cancelled", async () => {
      await useCMSStore.getState().loadAdminEventRegistrations();
      const reg = useCMSStore.getState().eventRegistrations[0];
      if (!reg) throw new Error("Expected registration");

      await useCMSStore.getState().updateEventRegistrationStatus(reg.id, "Attended");
      let updated = useCMSStore.getState().eventRegistrations.find((r) => r.id === reg.id);
      expect(updated?.status).toBe("Attended");

      await useCMSStore.getState().updateEventRegistrationStatus(reg.id, "Cancelled");
      updated = useCMSStore.getState().eventRegistrations.find((r) => r.id === reg.id);
      expect(updated?.status).toBe("Cancelled");
    });

    it("deletes a registration from state", async () => {
      await useCMSStore.getState().loadAdminEventRegistrations();
      const registrations = useCMSStore.getState().eventRegistrations;
      const target = registrations[0];
      if (!target) throw new Error("Expected registration");
      const countBefore = registrations.length;

      await useCMSStore.getState().deleteEventRegistration(target.id);
      const remaining = useCMSStore.getState().eventRegistrations;
      expect(remaining.length).toBe(countBefore - 1);
      expect(remaining.some((r) => r.id === target.id)).toBe(false);
    });
  });

  describe("Admin Form Submissions & Portal Applications", () => {
    it("loads portal form submissions successfully", async () => {
      await useCMSStore.getState().loadAdminFormSubmissions();
      const submissions = useCMSStore.getState().formSubmissions;
      expect(submissions.length).toBeGreaterThan(0);
      const first = submissions[0];
      if (!first) throw new Error("Expected submission");
      expect(first).toHaveProperty("kind");
      expect(first).toHaveProperty("payload");
      expect(first).toHaveProperty("email");
    });

    it("deletes a form submission from state", async () => {
      await useCMSStore.getState().loadAdminFormSubmissions();
      const submissions = useCMSStore.getState().formSubmissions;
      const target = submissions[0];
      if (!target) throw new Error("Expected submission");
      const countBefore = submissions.length;

      await useCMSStore.getState().deleteFormSubmission(target.id);
      const remaining = useCMSStore.getState().formSubmissions;
      expect(remaining.length).toBe(countBefore - 1);
      expect(remaining.some((s) => s.id === target.id)).toBe(false);
    });
  });

  describe("Live Inbound Data Pipelines to Admin Collections", () => {
    it("public user registration populates admin users list", async () => {
      const email = `public-member-${Date.now()}@climatify-youth.com`;
      const res = await apiService.registerMember({
        name: "Public Member",
        email,
        password: "secretPass123!"
      });
      expect(res.success).toBe(true);

      const adminUsers = await apiService.getAdminUsers();
      const found = adminUsers.find((u) => u.email === email);
      expect(found).toBeDefined();
      expect(found?.name).toBe("Public Member");
      expect(found?.role).toBe("member");
    });

    it("public event registration populates admin event registrations", async () => {
      const email = `attendee-${Date.now()}@climatify-youth.com`;
      await apiService.registerForEvent({
        eventId: "climate-hackathon-2026",
        name: "Eco Attendee",
        email,
        phone: "+971500000000"
      });

      const registrations = await apiService.getAdminEventRegistrations();
      const found = registrations.find((r) => r.email === email);
      expect(found).toBeDefined();
      expect(found?.name).toBe("Eco Attendee");
      expect(found?.status).toBe("Confirmed");
    });

    it("public partnership proposal populates admin submissions", async () => {
      const orgName = `Green Corp ${Date.now()}`;
      await apiService.submitPartnership({
        orgName,
        orgType: "corporate",
        contactPerson: "Dr. Sarah",
        email: "sarah@greencorp.ae",
        proposal: "Partnership proposal for youth climate empowerment"
      });

      const submissions = await apiService.getAdminFormSubmissions();
      const found = submissions.find(
        (s) => s.kind === "partner_portal" && (s.payload as { organizationName?: string }).organizationName === orgName
      );
      expect(found).toBeDefined();
    });

    it("supabaseService offline fallback populates admin collections with pipeline parity", async () => {
      const email = `supabase-member-${Date.now()}@climatify-youth.com`;
      const { supabaseService } = await import("../../services/supabaseApi");

      const regRes = await supabaseService.registerMember({
        name: "Supabase Member",
        email,
        password: "secretPass123!"
      });
      expect(regRes.success).toBe(true);

      const users = await supabaseService.getAdminUsers();
      const foundUser = users.find((u) => u.email === email);
      expect(foundUser).toBeDefined();
      expect(foundUser?.name).toBe("Supabase Member");

      const eventEmail = `supabase-event-${Date.now()}@climatify-youth.com`;
      await supabaseService.registerForEvent({
        eventId: "climate-hackathon-2026",
        name: "Supabase Attendee",
        email: eventEmail,
        phone: "+971501112233"
      });
      const regs = await supabaseService.getAdminEventRegistrations();
      expect(regs.some((r) => r.email === eventEmail)).toBe(true);

      const subEmail = `supabase-sub-${Date.now()}@climatify-youth.com`;
      await supabaseService.bookMeeting({
        name: "Meeting Booker",
        email: subEmail,
        date: "2026-11-20",
        time: "10:00",
        notes: "Climate Digitization Demo"
      });

      const partnerEmail = `supabase-partner-${Date.now()}@climatify-youth.com`;
      await supabaseService.submitPartnership({
        orgName: "UAE Climate Lab",
        orgType: "Research",
        contactPerson: "Dr. Rashid",
        email: partnerEmail,
        proposal: "Joint R&D"
      });

      const schoolEmail = `supabase-school-${Date.now()}@climatify-youth.com`;
      await supabaseService.submitWorkshopRequest({
        institutionName: "Al Noor Academy",
        city: "Abu Dhabi",
        studentCount: "120",
        workshopType: "AgriClash Simulation",
        email: schoolEmail
      });

      const contactEmail = `supabase-contact-${Date.now()}@climatify-youth.com`;
      await supabaseService.submitContact({
        firstName: "Contact",
        lastName: "Sender",
        email: contactEmail,
        subject: "General Inquiry",
        message: "Hello Climatify team!"
      });

      const subs = await supabaseService.getAdminFormSubmissions();
      expect(subs.some((s) => s.email === subEmail && s.kind === "meeting")).toBe(true);
      expect(
        subs.some(
          (s) =>
            s.email === partnerEmail &&
            s.kind === "partner_portal" &&
            (s.payload as { organizationName?: string }).organizationName === "UAE Climate Lab"
        )
      ).toBe(true);
      expect(
        subs.some(
          (s) =>
            s.email === schoolEmail &&
            s.kind === "school_portal" &&
            (s.payload as { schoolName?: string }).schoolName === "Al Noor Academy"
        )
      ).toBe(true);
      // Contact messages belong in getAdminMessages, not form_submissions
      expect(subs.some((s) => s.email === contactEmail)).toBe(false);
      const msgs = await supabaseService.getAdminMessages();
      expect(msgs.some((m) => m.email === contactEmail)).toBe(true);
      const { mockAdminMessages } = await import("../../services/mockData");
      const msgIdx = mockAdminMessages.findIndex((m) => m.email === contactEmail);
      if (msgIdx !== -1) mockAdminMessages.splice(msgIdx, 1);
    });
  });
});
