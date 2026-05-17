import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { getPublicInstitutions } from "../../api/institutionsApi";
import { createTrainerRequest } from "../../api/trainerRequestsApi";
import { InlineError } from "../../components/feedback/inlineError";
import { LoadingState } from "../../components/feedback/loadingState";
import { SuccessState } from "../../components/feedback/successState";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { SectionHeader } from "../../components/ui/sectionHeader";
import { Select } from "../../components/ui/select";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNotification } from "../../hooks/useNotification";
import type { InstitutionOption } from "../../types/institutionTypes";

const PendingTrainerPage = () => {
  const { backendUser } = useAuthContext();
  const { notifyError, notifySuccess } = useNotification();
  const [institutionId, setInstitutionId] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const institutionsQuery = useQuery({
    queryKey: ["public-institutions", "dropdown"],
    queryFn: getPublicInstitutions,
  });
  const institutions = useMemo<InstitutionOption[]>(() => {
    return institutionsQuery.data ?? [];
  }, [institutionsQuery.data]);

  const createRequestMutation = useMutation({
    mutationFn: createTrainerRequest,
    onSuccess: () => {
      setLocalError(null);
      setRequestSuccess("Trainer access request submitted. Please wait for institution approval.");
      setAlreadyRequested(true);
      notifySuccess("Request submitted", "Trainer access request is now pending approval.");
    },
    onError: (error) => {
      if (error.message === "Conflict") {
        setAlreadyRequested(true);
        setRequestSuccess("Trainer access request already submitted and pending review.");
        notifySuccess("Request already pending");
        return;
      }

      setRequestSuccess(null);
      setLocalError(error.message);
      notifyError("Request submission failed", error.message);
    },
  });

  const handleSubmitRequest = () => {
    if (!institutionId) {
      setLocalError("Select an institution first");
      return;
    }

    setLocalError(null);
    setRequestSuccess(null);
    createRequestMutation.mutate({ institutionId });
  };

  const hasInstitutions = institutions.length > 0;
  const disableRequestButton =
    institutionsQuery.isLoading || createRequestMutation.isPending || alreadyRequested || !hasInstitutions;

  return (
    <div className="space-y-6">
      <Card id="overview" className="scroll-mt-24">
        <SectionHeader title="Pending Trainer Review" subtitle="Submit and track trainer access request." />
        <p className="body-text">Role: {backendUser?.role ?? "Unknown"}</p>
        <p className="muted-text mt-1">Your trainer request is under review. Access is limited until approval.</p>
      </Card>

      <Card id="request" className="scroll-mt-24">
        <SectionHeader title="Request Trainer Access" subtitle="Choose institution and submit your request." />
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="institutionOption" className="field-label">
              Institution
            </label>
            <Select
              id="institutionOption"
              value={institutionId}
              onChange={(event) => setInstitutionId(event.target.value)}
              disabled={disableRequestButton}
            >
              <option value="">
                {institutionsQuery.isLoading ? "Loading institutions..." : "Select institution"}
              </option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </Select>
          </div>
          {!institutionsQuery.isLoading && !hasInstitutions ? (
            <p className="text-sm text-amber-700">No institutions available right now.</p>
          ) : null}
          {institutionsQuery.isLoading ? <LoadingState label="Loading institutions..." /> : null}
          <InlineError message={institutionsQuery.isError ? "Unable to load institutions. Try again." : null} />
          <InlineError message={localError} />
          <SuccessState message={requestSuccess} />
          <Button
            onClick={handleSubmitRequest}
            isLoading={createRequestMutation.isPending}
            disabled={disableRequestButton}
          >
            {createRequestMutation.isPending ? "Submitting..." : "Request Trainer Access"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export { PendingTrainerPage };
