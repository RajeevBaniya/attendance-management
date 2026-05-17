import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createInstitution, createInstitutionAdmin } from "../../api/institutionsApi";
import { CreateInstitutionAdminForm } from "../../components/superAdmin/createInstitutionAdminForm";
import { CreateInstitutionForm } from "../../components/superAdmin/createInstitutionForm";
import { Card } from "../../components/ui/card";
import { SectionHeader } from "../../components/ui/sectionHeader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotification } from "../../hooks/useNotification";
import type { CreateInstitutionAdminFormValues } from "../../components/superAdmin/createInstitutionAdminForm";
import type { CreateInstitutionFormValues } from "../../components/superAdmin/createInstitutionForm";

const SuperAdminDashboardPage = () => {
  const queryClient = useQueryClient();
  const { backendUser } = useAuthContext();
  const { notifyError, notifySuccess } = useNotification();
  const [institutionError, setInstitutionError] = useState<string | null>(null);
  const [institutionSuccess, setInstitutionSuccess] = useState<string | null>(null);
  const [institutionFormResetToken, setInstitutionFormResetToken] = useState(0);
  const [institutionAdminError, setInstitutionAdminError] = useState<string | null>(null);
  const [institutionAdminSuccess, setInstitutionAdminSuccess] = useState<string | null>(null);
  const [institutionAdminFormResetToken, setInstitutionAdminFormResetToken] = useState(0);

  const createInstitutionMutation = useMutation({
    mutationFn: createInstitution,
    onSuccess: (institution) => {
      setInstitutionError(null);
      setInstitutionSuccess(`Institution created: ${institution.name} (${institution.id})`);
      notifySuccess("Institution created", `${institution.name} is now available.`);
      setInstitutionFormResetToken((previous) => previous + 1);
      void queryClient.invalidateQueries({ queryKey: ["institutions", "super-admin"] });
    },
    onError: (error) => {
      setInstitutionSuccess(null);
      setInstitutionError(error.message);
      notifyError("Institution creation failed", error.message);
    },
  });

  const createInstitutionAdminMutation = useMutation({
    mutationFn: ({ institutionId, name, email, password }: CreateInstitutionAdminFormValues) => {
      return createInstitutionAdmin(institutionId, { name, email, password });
    },
    onSuccess: (institutionAdmin) => {
      setInstitutionAdminError(null);
      setInstitutionAdminSuccess(
        `Institution admin created: ${institutionAdmin.name} (${institutionAdmin.email ?? "No email"})`,
      );
      notifySuccess("Institution admin created", `${institutionAdmin.name} can now access institution tools.`);
      setInstitutionAdminFormResetToken((previous) => previous + 1);
    },
    onError: (error) => {
      setInstitutionAdminSuccess(null);
      setInstitutionAdminError(error.message);
      notifyError("Institution admin creation failed", error.message);
    },
  });

  const handleCreateInstitution = (values: CreateInstitutionFormValues) => {
    setInstitutionSuccess(null);
    setInstitutionError(null);
    createInstitutionMutation.mutate(values);
  };

  const handleCreateInstitutionAdmin = (values: CreateInstitutionAdminFormValues) => {
    setInstitutionAdminSuccess(null);
    setInstitutionAdminError(null);
    createInstitutionAdminMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <Card id="overview" className="scroll-mt-24">
        <SectionHeader title="Super Admin Dashboard" subtitle="Institution lifecycle, access and platform setup." />
        <p className="body-text">Role: {backendUser?.role ?? "Unknown"}</p>
        <p className="muted-text mt-1">User: {backendUser?.email ?? "Unknown"}</p>
      </Card>

      <Card id="institutions" className="scroll-mt-24">
        <SectionHeader title="Create Institution" subtitle="Provision a new institution in Attendly." />
        <div className="mt-4">
          <CreateInstitutionForm
            key={institutionFormResetToken}
            isSubmitting={createInstitutionMutation.isPending}
            errorMessage={institutionError}
            successMessage={institutionSuccess}
            onSubmit={handleCreateInstitution}
          />
        </div>
      </Card>

      <Card id="admins" className="scroll-mt-24">
        <SectionHeader
          title="Create Institution Admin"
          subtitle="Create institution admin account with name, email, and password."
        />
        <p className="muted-text mt-1">
          Create institution admin account with name, email, and password.
        </p>
        <div className="mt-4">
          <CreateInstitutionAdminForm
            key={institutionAdminFormResetToken}
            isSubmitting={createInstitutionAdminMutation.isPending}
            errorMessage={institutionAdminError}
            successMessage={institutionAdminSuccess}
            onSubmit={handleCreateInstitutionAdmin}
          />
        </div>
      </Card>
    </div>
  );
};

export { SuperAdminDashboardPage };
