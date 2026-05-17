import { ROLE } from "../types/authTypes";
import type { BackendRole } from "../types/authTypes";

type NavigationItem = {
  id: string;
  label: string;
  to: string;
  description?: string;
};

type NavigationSection = {
  id: string;
  label: string;
  items: NavigationItem[];
};

type RoleNavigationConfig = Record<BackendRole, NavigationSection[]>;

const roleNavigationConfig: RoleNavigationConfig = {
  [ROLE.SUPER_ADMIN]: [
    {
      id: "super-admin-account",
      label: "Account",
      items: [{ id: "super-admin-settings", label: "Settings", to: "/settings" }],
    },
    {
      id: "super-admin-main",
      label: "Admin",
      items: [
        { id: "super-admin-overview", label: "Overview", to: "/super-admin#overview" },
        { id: "super-admin-institutions", label: "Institutions", to: "/super-admin#institutions" },
        { id: "super-admin-admins", label: "Admins", to: "/super-admin#admins" },
      ],
    },
  ],
  [ROLE.INSTITUTION]: [
    {
      id: "institution-account",
      label: "Account",
      items: [{ id: "institution-settings", label: "Settings", to: "/settings" }],
    },
    {
      id: "institution-main",
      label: "Institution",
      items: [
        { id: "institution-overview", label: "Overview", to: "/institution#overview" },
        { id: "institution-batches", label: "Batches", to: "/institution#batches" },
        { id: "institution-trainers", label: "Trainers", to: "/institution#trainers" },
        { id: "institution-requests", label: "Requests", to: "/institution#requests" },
      ],
    },
  ],
  [ROLE.TRAINER]: [
    {
      id: "trainer-account",
      label: "Account",
      items: [{ id: "trainer-settings", label: "Settings", to: "/settings" }],
    },
    {
      id: "trainer-main",
      label: "Trainer",
      items: [
        { id: "trainer-overview", label: "Overview", to: "/trainer#overview" },
        { id: "trainer-sessions", label: "Sessions", to: "/trainer#sessions" },
        { id: "trainer-attendance", label: "Attendance", to: "/trainer#attendance" },
        { id: "trainer-invites", label: "Invites", to: "/trainer#invites" },
      ],
    },
  ],
  [ROLE.STUDENT]: [
    {
      id: "student-account",
      label: "Account",
      items: [{ id: "student-settings", label: "Settings", to: "/settings" }],
    },
    {
      id: "student-main",
      label: "Student",
      items: [
        { id: "student-overview", label: "Overview", to: "/student#overview" },
        { id: "student-join", label: "Join Batch", to: "/student#join-batch" },
        { id: "student-attendance", label: "Attendance", to: "/student#attendance" },
      ],
    },
  ],
  [ROLE.PROGRAMME_MANAGER]: [
    {
      id: "programme-account",
      label: "Account",
      items: [{ id: "programme-settings", label: "Settings", to: "/settings" }],
    },
    {
      id: "programme-main",
      label: "Programme",
      items: [
        { id: "programme-overview", label: "Overview", to: "/programme-manager#overview" },
        { id: "programme-analytics", label: "Analytics", to: "/programme-manager#analytics" },
        { id: "programme-institutions", label: "Institutions", to: "/programme-manager#institutions" },
      ],
    },
  ],
  [ROLE.MONITORING_OFFICER]: [
    {
      id: "monitoring-account",
      label: "Account",
      items: [{ id: "monitoring-settings", label: "Settings", to: "/settings" }],
    },
    {
      id: "monitoring-main",
      label: "Monitoring",
      items: [
        { id: "monitoring-overview", label: "Global Overview", to: "/monitoring#global-overview" },
        { id: "monitoring-institutions", label: "Institutions", to: "/monitoring#institutions" },
        { id: "monitoring-metrics", label: "Metrics", to: "/monitoring#metrics" },
      ],
    },
  ],
  [ROLE.PENDING_TRAINER]: [
    {
      id: "pending-trainer-account",
      label: "Account",
      items: [{ id: "pending-trainer-settings", label: "Settings", to: "/settings" }],
    },
    {
      id: "pending-trainer-main",
      label: "Trainer Access",
      items: [
        { id: "pending-trainer-overview", label: "Overview", to: "/pending-trainer#overview" },
        { id: "pending-trainer-request", label: "Request", to: "/pending-trainer#request" },
      ],
    },
  ],
};

const pageHeaderMap: Record<string, { title: string; subtitle: string }> = {
  "/super-admin": {
    title: "Super Admin Workspace",
    subtitle: "Institution setup and platform administration.",
  },
  "/institution": {
    title: "Institution Workspace",
    subtitle: "Batches, trainers, and request operations.",
  },
  "/trainer": {
    title: "Trainer Workspace",
    subtitle: "Sessions, invites, and attendance workflows.",
  },
  "/student": {
    title: "Student Workspace",
    subtitle: "Batch enrollment and attendance visibility.",
  },
  "/programme-manager": {
    title: "Programme Manager Workspace",
    subtitle: "Cross-institution analytics and programme overview.",
  },
  "/monitoring": {
    title: "Monitoring Workspace",
    subtitle: "Read-only operational oversight and metrics.",
  },
  "/pending-trainer": {
    title: "Pending Trainer Workspace",
    subtitle: "Submit and track trainer access approval.",
  },
  "/settings": {
    title: "Account Settings",
    subtitle: "Profile, role and session context.",
  },
};

const getNavigationSectionsForRole = (role: BackendRole | null) => {
  if (!role) {
    return [];
  }

  return roleNavigationConfig[role] ?? [];
};

const getPageHeaderForPath = (pathname: string) => {
  return (
    pageHeaderMap[pathname] ?? {
      title: "Attendly Workspace",
      subtitle: "Role-based training operations.",
    }
  );
};

export { getNavigationSectionsForRole, getPageHeaderForPath };
export type { NavigationItem, NavigationSection, RoleNavigationConfig };
