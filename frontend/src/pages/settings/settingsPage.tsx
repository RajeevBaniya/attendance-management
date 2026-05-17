import { useAuth, useUser } from "@clerk/clerk-react";

import { AccountInfoCard } from "../../components/profile/accountInfoCard";
import { Card } from "../../components/ui/card";
import { SectionHeader } from "../../components/ui/sectionHeader";
import { useAuthContext } from "../../hooks/useAuthContext";

const SettingsPage = () => {
  const { backendUser, role, syncStatus } = useAuthContext();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeader title="Settings" subtitle="Read-only account and session overview." />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AccountInfoCard
          title="Account"
          items={[
            { label: "Name", value: backendUser?.name ?? user?.fullName ?? "Unknown" },
            { label: "Email", value: backendUser?.email ?? user?.primaryEmailAddress?.emailAddress ?? "Unknown" },
            { label: "Clerk User ID", value: user?.id ?? backendUser?.clerkUserId ?? "Not available" },
          ]}
        />

        <AccountInfoCard
          title="Role Context"
          items={[
            { label: "Role", value: role ?? "Unknown" },
            { label: "Institution ID", value: backendUser?.institutionId ?? "Not assigned" },
            { label: "Backend Sync", value: syncStatus.toUpperCase() },
          ]}
        />

        <AccountInfoCard
          title="Session"
          items={[
            { label: "Auth Session", value: isSignedIn ? "Active" : "Inactive" },
            { label: "Device", value: navigator.platform || "Unknown" },
            { label: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown" },
          ]}
        />
      </div>
    </div>
  );
};

export { SettingsPage };
