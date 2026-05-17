import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getAnalyticsInstitutions, getInstitutionSummary, getProgrammeSummary } from "../../api/analyticsApi";
import {
  exportInstitutionAttendanceSummaryReport,
  exportProgrammeSummaryReport,
  triggerCsvDownload,
} from "../../api/reportsApi";
import { AttendanceOverview } from "../../components/analytics/attendanceOverview";
import { MetricBadge } from "../../components/analytics/metricBadge";
import { SummaryGrid } from "../../components/analytics/summaryGrid";
import { DataTable } from "../../components/data-display/dataTable";
import { PaginationControls } from "../../components/data-display/paginationControls";
import { SearchInput } from "../../components/data-display/searchInput";
import { StatusBadge } from "../../components/data-display/statusBadge";
import { Card } from "../../components/ui/card";
import { ExportButton } from "../../components/reports/exportButton";
import { ReportCard } from "../../components/reports/reportCard";
import { Select } from "../../components/ui/select";
import { SectionHeader } from "../../components/ui/sectionHeader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useNotification } from "../../hooks/useNotification";
import { matchesSearch } from "../../utils/dataFilters";
import type { MetricBadgeProps } from "../../components/analytics/metricBadge";

const getAttendanceTone = (attendancePercentage: number): MetricBadgeProps["tone"] => {
  if (attendancePercentage >= 80) {
    return "positive";
  }

  if (attendancePercentage >= 60) {
    return "neutral";
  }

  return "warning";
};

const ProgrammeManagerDashboardPage = () => {
  const PAGE_LIMIT = 10;
  const { backendUser } = useAuthContext();
  const { notifyError, notifySuccess } = useNotification();
  const [selectedInstitutionId, setSelectedInstitutionId] = useState("");
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [institutionsPage, setInstitutionsPage] = useState(1);
  const debouncedInstitutionSearch = useDebouncedValue(institutionSearch, 300);

  const programmeSummaryQuery = useQuery({
    queryKey: ["analytics", "programme", "manager"],
    queryFn: getProgrammeSummary,
  });

  const institutionsQuery = useQuery({
    queryKey: ["analytics", "institutions", "manager", institutionsPage, PAGE_LIMIT],
    queryFn: () => getAnalyticsInstitutions({ page: institutionsPage, limit: PAGE_LIMIT }),
  });

  const institutionSummaryQuery = useQuery({
    queryKey: ["analytics", "institution", selectedInstitutionId, "manager"],
    queryFn: () => getInstitutionSummary(selectedInstitutionId),
    enabled: selectedInstitutionId.length > 0,
  });
  const exportInstitutionReportMutation = useMutation({
    mutationFn: async () => {
      const file = await exportInstitutionAttendanceSummaryReport({
        institutionId: selectedInstitutionId || undefined,
      });
      triggerCsvDownload(file);
    },
    onSuccess: () => notifySuccess("Report exported", "Institution summary CSV downloaded."),
    onError: (error) => notifyError("Report export failed", error.message),
  });
  const exportProgrammeReportMutation = useMutation({
    mutationFn: async () => {
      const file = await exportProgrammeSummaryReport();
      triggerCsvDownload(file);
    },
    onSuccess: () => notifySuccess("Report exported", "Programme summary CSV downloaded."),
    onError: (error) => notifyError("Report export failed", error.message),
  });
  const filteredInstitutions =
    institutionsQuery.data?.items.filter((institution) =>
      matchesSearch(institution.name, debouncedInstitutionSearch),
    ) ?? [];

  return (
    <div className="space-y-6">
      <Card id="overview" className="scroll-mt-24">
        <SectionHeader
          title="Programme Manager Dashboard"
          subtitle="Cross-institution analytics and planning visibility."
        />
        <p className="body-text">Role: {backendUser?.role ?? "Unknown"}</p>
        <p className="muted-text mt-1">User: {backendUser?.email ?? "Unknown"}</p>
      </Card>

      <Card id="analytics" className="scroll-mt-24">
        <SectionHeader title="Programme Summary" subtitle="Operational coverage for all institutions." />
        {programmeSummaryQuery.isPending ? <p className="muted-text">Loading programme metrics...</p> : null}
        {programmeSummaryQuery.isError ? (
          <p className="text-sm text-rose-300">Failed to load programme metrics: {programmeSummaryQuery.error.message}</p>
        ) : null}
        {programmeSummaryQuery.data ? (
          <div className="space-y-4">
            <SummaryGrid
              items={[
                {
                  title: "Institutions",
                  value: String(programmeSummaryQuery.data.totalInstitutions),
                  helperText: "Participating institutions",
                },
                {
                  title: "Batches",
                  value: String(programmeSummaryQuery.data.totalBatches),
                  helperText: "Total batch operations",
                },
                {
                  title: "Students",
                  value: String(programmeSummaryQuery.data.totalStudents),
                  helperText: "Current programme enrollment",
                },
                {
                  title: "Sessions",
                  value: String(programmeSummaryQuery.data.totalSessions),
                  helperText: "Tracked session count",
                },
              ]}
              renderBadge={(badge) => <MetricBadge label={badge.label} tone={badge.tone} />}
            />
            <AttendanceOverview
              title="Programme Attendance Trend"
              subtitle="Current attendance ratio from recorded session attendance."
              metrics={programmeSummaryQuery.data}
            />
          </div>
        ) : null}
      </Card>

      <Card id="institutions" className="scroll-mt-24">
        <SectionHeader
          title="Institution Participation"
          subtitle="Inspect one institution at a time for targeted operational review."
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <SearchInput
            value={institutionSearch}
            placeholder="Search institution by name"
            onChange={setInstitutionSearch}
          />
          <div>
            <label htmlFor="programme-institution" className="field-label">
              Institution
            </label>
            <Select
              id="programme-institution"
              value={selectedInstitutionId}
              onChange={(event) => {
                setSelectedInstitutionId(event.target.value);
              }}
              disabled={institutionsQuery.isPending || institutionsQuery.isError}
            >
              <option value="">Select institution</option>
              {filteredInstitutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        {institutionsQuery.isPending ? <p className="muted-text mt-3">Loading institutions...</p> : null}
        {institutionsQuery.isError ? (
          <p className="mt-3 text-sm text-rose-300">Failed to load institutions: {institutionsQuery.error.message}</p>
        ) : null}
        {!institutionsQuery.isPending &&
        !institutionsQuery.isError &&
        (institutionsQuery.data?.items.length ?? 0) === 0 ? (
          <p className="muted-text mt-3">No institutions available.</p>
        ) : null}
        {!institutionsQuery.isPending && !institutionsQuery.isError ? (
          <div className="mt-4">
            <DataTable
              data={filteredInstitutions}
              columns={[
                {
                  id: "institution",
                  label: "Institution",
                  renderCell: (institution) => <span className="font-medium text-slate-100">{institution.name}</span>,
                },
                {
                  id: "selection",
                  label: "Selection",
                  renderCell: (institution) =>
                    institution.id === selectedInstitutionId ? (
                      <StatusBadge label="SELECTED" variant="info" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedInstitutionId(institution.id)}
                        className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
                      >
                        Select
                      </button>
                    ),
                },
              ]}
              getKey={(institution) => institution.id}
              getMobileTitle={(institution) => institution.name}
              getMobileSubtitle={() => "Institution participation"}
              getMobileMeta={(institution) =>
                institution.id === selectedInstitutionId ? (
                  <StatusBadge label="SELECTED" variant="info" />
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedInstitutionId(institution.id)}
                    className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200"
                  >
                    Select
                  </button>
                )
              }
              emptyTitle="No institutions found"
              emptyDescription="Adjust search term."
            />
          </div>
        ) : null}
        {institutionsQuery.data ? (
          <PaginationControls pagination={institutionsQuery.data.pagination} onPageChange={setInstitutionsPage} />
        ) : null}

        {selectedInstitutionId.length > 0 && institutionSummaryQuery.isPending ? (
          <p className="muted-text mt-4">Loading institution metrics...</p>
        ) : null}
        {selectedInstitutionId.length > 0 && institutionSummaryQuery.isError ? (
          <p className="mt-4 text-sm text-rose-300">
            Failed to load institution metrics: {institutionSummaryQuery.error.message}
          </p>
        ) : null}
        {institutionSummaryQuery.data ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-200">Institution operational snapshot</p>
              <MetricBadge
                label={`${institutionSummaryQuery.data.attendancePercentage.toFixed(2)}% attendance`}
                tone={getAttendanceTone(institutionSummaryQuery.data.attendancePercentage)}
              />
            </div>
            <SummaryGrid
              items={[
                {
                  title: "Batches",
                  value: String(institutionSummaryQuery.data.totalBatches),
                  helperText: "Batches in institution",
                },
                {
                  title: "Students",
                  value: String(institutionSummaryQuery.data.totalStudents),
                  helperText: "Active students",
                },
                {
                  title: "Sessions",
                  value: String(institutionSummaryQuery.data.totalSessions),
                  helperText: "Sessions delivered",
                },
              ]}
              renderBadge={(badge) => <MetricBadge label={badge.label} tone={badge.tone} />}
            />
            <AttendanceOverview
              title="Institution Attendance Trend"
              subtitle="Read-only attendance health for selected institution."
              metrics={institutionSummaryQuery.data}
            />
          </div>
        ) : null}
      </Card>

      <ReportCard
        id="reports"
        title="Operational Reports"
        subtitle="Download institution and programme operational summaries."
      >
        <div className="flex flex-wrap gap-2">
          <ExportButton
            label="Export Institution Summary CSV"
            isLoading={exportInstitutionReportMutation.isPending}
            onClick={() => exportInstitutionReportMutation.mutate()}
          />
          <ExportButton
            label="Export Programme Summary CSV"
            isLoading={exportProgrammeReportMutation.isPending}
            onClick={() => exportProgrammeReportMutation.mutate()}
          />
        </div>
      </ReportCard>
    </div>
  );
};

export { ProgrammeManagerDashboardPage };
