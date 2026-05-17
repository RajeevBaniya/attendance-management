import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { assignTrainerToBatch, createBatch, getBatches } from "../../api/batchesApi";
import { getInstitutionTrainers } from "../../api/institutionsApi";
import {
  exportInstitutionAttendanceSummaryReport,
  triggerCsvDownload,
} from "../../api/reportsApi";
import { approveTrainerRequest, getTrainerRequests } from "../../api/trainerRequestsApi";
import { DataTable } from "../../components/data-display/dataTable";
import { EmptyState } from "../../components/data-display/emptyState";
import { FilterSelect } from "../../components/data-display/filterSelect";
import { PaginationControls } from "../../components/data-display/paginationControls";
import { SearchInput } from "../../components/data-display/searchInput";
import { StatusBadge } from "../../components/data-display/statusBadge";
import { InlineError } from "../../components/feedback/inlineError";
import { LoadingState } from "../../components/feedback/loadingState";
import { AssignTrainerForm } from "../../components/institution/assignTrainerForm";
import { CreateBatchForm } from "../../components/institution/createBatchForm";
import { ExportButton } from "../../components/reports/exportButton";
import { ReportCard } from "../../components/reports/reportCard";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { SectionHeader } from "../../components/ui/sectionHeader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useNotification } from "../../hooks/useNotification";
import { matchesSearch, matchesStatus } from "../../utils/dataFilters";
import type { AssignTrainerFormValues } from "../../components/institution/assignTrainerForm";
import type { CreateBatchFormValues } from "../../components/institution/createBatchForm";
import type { AttendanceStatusFilter } from "../../types/reportTypes";
import type { DatePresetFilter } from "../../utils/dataFilters";

const InstitutionDashboardPage = () => {
  const PAGE_LIMIT = 10;
  const queryClient = useQueryClient();
  const { backendUser } = useAuthContext();
  const { notifyError, notifySuccess } = useNotification();
  const [createBatchError, setCreateBatchError] = useState<string | null>(null);
  const [createBatchSuccess, setCreateBatchSuccess] = useState<string | null>(null);
  const [assignTrainerError, setAssignTrainerError] = useState<string | null>(null);
  const [assignTrainerSuccess, setAssignTrainerSuccess] = useState<string | null>(null);
  const [batchSearch, setBatchSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("PENDING");
  const [requestSearch, setRequestSearch] = useState("");
  const [reportDateFilter, setReportDateFilter] = useState<DatePresetFilter>("ALL");
  const [reportStatusFilter, setReportStatusFilter] = useState<AttendanceStatusFilter>("ALL");
  const [reportBatchId, setReportBatchId] = useState("");
  const [batchPage, setBatchPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const debouncedBatchSearch = useDebouncedValue(batchSearch, 300);
  const debouncedRequestSearch = useDebouncedValue(requestSearch, 300);
  const batchesQuery = useQuery({
    queryKey: ["institution-batches", batchPage, PAGE_LIMIT],
    queryFn: () => getBatches({ page: batchPage, limit: PAGE_LIMIT }),
  });
  const institutionTrainersQuery = useQuery({
    queryKey: ["institution-trainers"],
    queryFn: getInstitutionTrainers,
  });
  const trainerRequestsQuery = useQuery({
    queryKey: ["trainer-requests", "institution", requestPage, PAGE_LIMIT],
    queryFn: () => getTrainerRequests({ page: requestPage, limit: PAGE_LIMIT }),
  });
  const createBatchMutation = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      setCreateBatchError(null);
      setCreateBatchSuccess("Batch created successfully.");
      notifySuccess("Batch created", "New batch is now available in your institution.");
      void queryClient.invalidateQueries({ queryKey: ["institution-batches"] });
    },
    onError: (error) => {
      setCreateBatchSuccess(null);
      setCreateBatchError(error.message);
      notifyError("Batch creation failed", error.message);
    },
  });
  const assignTrainerMutation = useMutation({
    mutationFn: ({ batchId, trainerId }: AssignTrainerFormValues) => {
      return assignTrainerToBatch(batchId, { trainerId });
    },
    onSuccess: () => {
      setAssignTrainerError(null);
      setAssignTrainerSuccess("Trainer assigned to batch.");
      notifySuccess("Trainer assigned", "Trainer has been assigned to selected batch.");
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["institution-batches"] }),
        queryClient.invalidateQueries({ queryKey: ["trainer-requests", "institution"] }),
      ]);
    },
    onError: (error) => {
      setAssignTrainerSuccess(null);
      setAssignTrainerError(error.message);
      notifyError("Trainer assignment failed", error.message);
    },
  });
  const approveTrainerRequestMutation = useMutation({
    mutationFn: approveTrainerRequest,
    onSuccess: () => {
      notifySuccess("Trainer approved", "Trainer request has been approved.");
      void queryClient.invalidateQueries({ queryKey: ["trainer-requests", "institution"] });
    },
    onError: (error) => {
      notifyError("Trainer approval failed", error.message);
    },
  });
  const exportReportMutation = useMutation({
    mutationFn: async () => {
      const file = await exportInstitutionAttendanceSummaryReport({
        datePreset: reportDateFilter,
        status: reportStatusFilter,
        batchId: reportBatchId || undefined,
      });
      triggerCsvDownload(file);
    },
    onSuccess: () => {
      notifySuccess("Report exported", "Institution attendance summary CSV downloaded.");
    },
    onError: (error) => {
      notifyError("Report export failed", error.message);
    },
  });

  const pendingRequests =
    trainerRequestsQuery.data?.items.filter((trainerRequest) => trainerRequest.status === "PENDING") ?? [];
  const filteredBatches = useMemo(
    () =>
      (batchesQuery.data?.items ?? [])
        .filter((batch) => matchesSearch(batch.name, debouncedBatchSearch))
        .toSorted((first, second) =>
          first.name.localeCompare(second.name),
        ),
    [batchesQuery.data?.items, debouncedBatchSearch],
  );
  const filteredRequests = useMemo(
    () =>
      (trainerRequestsQuery.data?.items ?? [])
        .filter((trainerRequest) => matchesStatus(trainerRequest.status, requestStatusFilter))
        .filter((trainerRequest) =>
          matchesSearch(`${trainerRequest.name} ${trainerRequest.email ?? ""}`, debouncedRequestSearch),
        )
        .toSorted(
          (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
        ),
    [debouncedRequestSearch, requestStatusFilter, trainerRequestsQuery.data?.items],
  );
  const handleCreateBatch = (values: CreateBatchFormValues) => {
    setCreateBatchSuccess(null);
    setCreateBatchError(null);
    createBatchMutation.mutate(values);
  };
  const handleAssignTrainer = (values: AssignTrainerFormValues) => {
    setAssignTrainerSuccess(null);
    setAssignTrainerError(null);
    assignTrainerMutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <Card id="overview" className="scroll-mt-24">
        <SectionHeader title="Institution Dashboard" subtitle="Operational controls for batches and trainers." />
        <p className="body-text">Role: {backendUser?.role ?? "Unknown"}</p>
        <p className="muted-text mt-1">User: {backendUser?.email ?? "Unknown"}</p>
      </Card>

      <Card id="batches" className="scroll-mt-24">
        <SectionHeader title="Create Batch" subtitle="Create a new batch within this institution." />
        <div className="mt-4">
          <CreateBatchForm
            isSubmitting={createBatchMutation.isPending}
            errorMessage={createBatchError}
            successMessage={createBatchSuccess}
            onSubmit={handleCreateBatch}
          />
        </div>
      </Card>

      <Card id="batches-list" className="scroll-mt-24">
        <SectionHeader title="Institution Batches" subtitle="View institution batch list and assignment counts." />
        <div className="mt-4 space-y-3">
          <SearchInput value={batchSearch} placeholder="Search batches by name" onChange={setBatchSearch} />
          {batchesQuery.isLoading ? <LoadingState label="Loading batches..." /> : null}
          <InlineError message={batchesQuery.isError ? "Unable to load batches." : null} />
          {!batchesQuery.isLoading && !batchesQuery.isError ? (
            <DataTable
              data={filteredBatches}
              columns={[
                {
                  id: "batch-name",
                  label: "Batch",
                  renderCell: (batch) => <span className="font-medium text-slate-100">{batch.name}</span>,
                },
                {
                  id: "created-at",
                  label: "Created",
                  renderCell: (batch) => (
                    <span className="text-xs text-slate-400">{new Date(batch.createdAt).toLocaleDateString()}</span>
                  ),
                },
                {
                  id: "trainer-count",
                  label: "Trainers",
                  renderCell: (batch) => <span>{batch.trainerCount}</span>,
                },
                {
                  id: "student-count",
                  label: "Students",
                  renderCell: (batch) => <span>{batch.studentCount}</span>,
                },
              ]}
              getKey={(batch) => batch.id}
              getMobileTitle={(batch) => batch.name}
              getMobileSubtitle={(batch) => `Created ${new Date(batch.createdAt).toLocaleDateString()}`}
              getMobileMeta={(batch) => (
                <>
                  <StatusBadge label={`Trainers ${batch.trainerCount}`} variant="info" />
                  <StatusBadge label={`Students ${batch.studentCount}`} variant="neutral" />
                </>
              )}
              emptyTitle="No batches found"
              emptyDescription="Adjust search or create a new batch."
            />
          ) : null}
          {batchesQuery.data ? (
            <PaginationControls pagination={batchesQuery.data.pagination} onPageChange={setBatchPage} />
          ) : null}
        </div>
      </Card>

      <Card id="trainers" className="scroll-mt-24">
        <SectionHeader title="Assign Trainer To Batch" subtitle="Select a batch and trainer from dropdowns." />
        <div className="mt-4">
          <AssignTrainerForm
            batches={batchesQuery.data?.items ?? []}
            trainers={institutionTrainersQuery.data ?? []}
            isSubmitting={assignTrainerMutation.isPending}
            isLoadingOptions={batchesQuery.isLoading || institutionTrainersQuery.isLoading}
            errorMessage={assignTrainerError}
            successMessage={assignTrainerSuccess}
            onSubmit={handleAssignTrainer}
          />
        </div>
      </Card>

      <Card id="requests" className="scroll-mt-24">
        <SectionHeader title="Trainer Requests" subtitle="Search and filter approval queue." />
        {trainerRequestsQuery.isLoading ? <LoadingState label="Loading trainer requests..." /> : null}
        <InlineError message={trainerRequestsQuery.isError ? "Unable to load trainer requests." : null} />
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SearchInput value={requestSearch} placeholder="Search by name or email" onChange={setRequestSearch} />
            <FilterSelect
              value={requestStatusFilter}
              options={[
                { value: "PENDING", label: "Pending only" },
                { value: "APPROVED", label: "Approved only" },
                { value: "ALL", label: "All statuses" },
              ]}
              onChange={setRequestStatusFilter}
            />
          </div>
          {!trainerRequestsQuery.isLoading && !trainerRequestsQuery.isError ? (
            <DataTable
              data={filteredRequests}
              columns={[
                {
                  id: "requester",
                  label: "Requester",
                  renderCell: (trainerRequest) => (
                    <div>
                      <p className="font-medium text-slate-100">{trainerRequest.name}</p>
                      <p className="text-xs text-slate-400">{trainerRequest.email ?? "No email"}</p>
                    </div>
                  ),
                },
                {
                  id: "status",
                  label: "Status",
                  renderCell: (trainerRequest) => <StatusBadge label={trainerRequest.status} />,
                },
                {
                  id: "requested-at",
                  label: "Requested",
                  renderCell: (trainerRequest) => (
                    <span className="text-xs text-slate-400">
                      {new Date(trainerRequest.createdAt).toLocaleDateString()}
                    </span>
                  ),
                },
                {
                  id: "actions",
                  label: "Action",
                  renderCell: (trainerRequest) =>
                    trainerRequest.status === "PENDING" ? (
                      <Button
                        size="sm"
                        onClick={() => approveTrainerRequestMutation.mutate(trainerRequest.id)}
                        disabled={approveTrainerRequestMutation.isPending}
                      >
                        {approveTrainerRequestMutation.isPending ? "Approving..." : "Approve"}
                      </Button>
                    ) : (
                      <StatusBadge label="APPROVED" />
                    ),
                },
              ]}
              getKey={(trainerRequest) => trainerRequest.id}
              getMobileTitle={(trainerRequest) => trainerRequest.name}
              getMobileSubtitle={(trainerRequest) => trainerRequest.email ?? "No email"}
              getMobileMeta={(trainerRequest) => (
                <>
                  <StatusBadge label={trainerRequest.status} />
                  <StatusBadge
                    label={new Date(trainerRequest.createdAt).toLocaleDateString()}
                    variant="neutral"
                  />
                </>
              )}
              emptyTitle="No requests found"
              emptyDescription="Adjust search or status filter."
            />
          ) : null}
          {trainerRequestsQuery.data ? (
            <PaginationControls pagination={trainerRequestsQuery.data.pagination} onPageChange={setRequestPage} />
          ) : null}
          {!trainerRequestsQuery.isLoading &&
          !trainerRequestsQuery.isError &&
          requestStatusFilter === "PENDING" &&
          pendingRequests.length === 0 ? (
            <EmptyState title="No pending requests" description="All trainer requests are already processed." />
          ) : null}
        </div>
      </Card>

      <ReportCard
        id="reports"
        title="Operational Reports"
        subtitle="Export filtered attendance summary for institution operations."
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FilterSelect
            value={reportDateFilter}
            options={[
              { value: "ALL", label: "All dates" },
              { value: "TODAY", label: "Today" },
              { value: "LAST_7_DAYS", label: "Last 7 days" },
              { value: "LAST_30_DAYS", label: "Last 30 days" },
            ]}
            onChange={(value) => setReportDateFilter(value as DatePresetFilter)}
          />
          <FilterSelect
            value={reportStatusFilter}
            options={[
              { value: "ALL", label: "All statuses" },
              { value: "PRESENT", label: "Present" },
              { value: "ABSENT", label: "Absent" },
            ]}
            onChange={(value) => setReportStatusFilter(value as AttendanceStatusFilter)}
          />
          <FilterSelect
            value={reportBatchId}
            options={[
              { value: "", label: "All batches" },
              ...(batchesQuery.data?.items ?? []).map((batch) => ({ value: batch.id, label: batch.name })),
            ]}
            onChange={setReportBatchId}
          />
        </div>
        <ExportButton
          label="Export Institution Attendance CSV"
          isLoading={exportReportMutation.isPending}
          onClick={() => exportReportMutation.mutate()}
        />
      </ReportCard>
    </div>
  );
};

export { InstitutionDashboardPage };
