import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getStudentAttendance } from "../../api/attendanceApi";
import { joinBatchWithInvite } from "../../api/invitesApi";
import { exportStudentAttendanceReport, triggerCsvDownload } from "../../api/reportsApi";
import { DataTable } from "../../components/data-display/dataTable";
import { FilterSelect } from "../../components/data-display/filterSelect";
import { PaginationControls } from "../../components/data-display/paginationControls";
import { SearchInput } from "../../components/data-display/searchInput";
import { StatusBadge } from "../../components/data-display/statusBadge";
import { InlineError } from "../../components/feedback/inlineError";
import { LoadingState } from "../../components/feedback/loadingState";
import { SuccessState } from "../../components/feedback/successState";
import { ExportButton } from "../../components/reports/exportButton";
import { ReportCard } from "../../components/reports/reportCard";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { SectionHeader } from "../../components/ui/sectionHeader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useNotification } from "../../hooks/useNotification";
import { matchesDatePreset, matchesSearch, matchesStatus } from "../../utils/dataFilters";
import type { DatePresetFilter } from "../../utils/dataFilters";

const StudentDashboardPage = () => {
  const PAGE_LIMIT = 10;
  const { backendUser } = useAuthContext();
  const { notifyError, notifySuccess } = useNotification();
  const [token, setToken] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState("ALL");
  const [attendanceDateFilter, setAttendanceDateFilter] = useState<DatePresetFilter>("ALL");
  const [attendancePage, setAttendancePage] = useState(1);
  const debouncedAttendanceSearch = useDebouncedValue(attendanceSearch, 300);
  const joinBatchMutation = useMutation({
    mutationFn: joinBatchWithInvite,
    onSuccess: () => {
      setLocalError(null);
      setSuccessMessage("Batch joined successfully.");
      setToken("");
      notifySuccess("Batch joined", "You are now enrolled in the selected batch.");
    },
    onError: (error) => {
      setSuccessMessage(null);
      setLocalError(error.message);
      notifyError("Join batch failed", error.message);
    },
  });
  const studentAttendanceQuery = useQuery({
    queryKey: ["student-attendance", attendancePage, PAGE_LIMIT],
    queryFn: () => getStudentAttendance({ page: attendancePage, limit: PAGE_LIMIT }),
  });
  const exportReportMutation = useMutation({
    mutationFn: async () => {
      const file = await exportStudentAttendanceReport({
        datePreset: attendanceDateFilter,
        status: attendanceStatusFilter === "NOT_MARKED" ? "ALL" : (attendanceStatusFilter as "ALL" | "PRESENT" | "ABSENT"),
        search: attendanceSearch || undefined,
      });
      triggerCsvDownload(file);
    },
    onSuccess: () => {
      notifySuccess("Report exported", "Student attendance history CSV downloaded.");
    },
    onError: (error) => {
      notifyError("Report export failed", error.message);
    },
  });
  const filteredAttendance =
    studentAttendanceQuery.data?.items
      .filter((record) => matchesSearch(`${record.title} ${record.batchName}`, debouncedAttendanceSearch))
      .filter((record) => matchesStatus(record.status ?? "NOT_MARKED", attendanceStatusFilter))
      .filter((record) => matchesDatePreset(record.date, attendanceDateFilter))
      .toSorted((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()) ?? [];

  const handleJoinBatch = () => {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setLocalError("Invite token is required");
      return;
    }

    setLocalError(null);
    setSuccessMessage(null);
    joinBatchMutation.mutate({ token: trimmedToken });
  };

  return (
    <div className="space-y-6">
      <Card id="overview" className="scroll-mt-24">
        <SectionHeader title="Student Dashboard" subtitle="Join batches and monitor attendance progress." />
        <p className="body-text">Role: {backendUser?.role ?? "Unknown"}</p>
        <p className="muted-text mt-1">User: {backendUser?.email ?? "Unknown"}</p>
      </Card>

      <Card id="join-batch" className="scroll-mt-24">
        <SectionHeader title="Join Batch" subtitle="Paste invite token shared by your trainer." />
        <div className="mt-4 space-y-3">
          <Input
            type="text"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Enter invite token"
            disabled={joinBatchMutation.isPending}
          />
          <InlineError message={localError} />
          <SuccessState message={successMessage} />
          <Button onClick={handleJoinBatch} isLoading={joinBatchMutation.isPending}>
            {joinBatchMutation.isPending ? "Joining..." : "Join Batch"}
          </Button>
        </div>
      </Card>

      <Card id="attendance" className="scroll-mt-24">
        <SectionHeader title="My Attendance" />
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <SearchInput value={attendanceSearch} placeholder="Search by session or batch" onChange={setAttendanceSearch} />
          <FilterSelect
            value={attendanceStatusFilter}
            options={[
              { value: "ALL", label: "All statuses" },
              { value: "PRESENT", label: "Present" },
              { value: "ABSENT", label: "Absent" },
              { value: "NOT_MARKED", label: "Not marked" },
            ]}
            onChange={setAttendanceStatusFilter}
          />
          <FilterSelect
            value={attendanceDateFilter}
            options={[
              { value: "ALL", label: "All dates" },
              { value: "TODAY", label: "Today" },
              { value: "LAST_7_DAYS", label: "Last 7 days" },
              { value: "LAST_30_DAYS", label: "Last 30 days" },
            ]}
            onChange={(value) => setAttendanceDateFilter(value as DatePresetFilter)}
          />
        </div>
        {studentAttendanceQuery.isLoading ? <LoadingState label="Loading attendance..." /> : null}
        <InlineError message={studentAttendanceQuery.isError ? "Unable to load attendance." : null} />
        {!studentAttendanceQuery.isLoading && !studentAttendanceQuery.isError ? (
          <div className="mt-4">
            <DataTable
              data={filteredAttendance}
              columns={[
                {
                  id: "session",
                  label: "Session",
                  renderCell: (record) => <span className="font-medium text-slate-100">{record.title}</span>,
                },
                {
                  id: "batch",
                  label: "Batch",
                  renderCell: (record) => <span>{record.batchName}</span>,
                },
                {
                  id: "date",
                  label: "Date",
                  renderCell: (record) => (
                    <span className="text-xs text-slate-400">{new Date(record.date).toLocaleDateString()}</span>
                  ),
                },
                {
                  id: "status",
                  label: "Status",
                  renderCell: (record) => <StatusBadge label={record.status ?? "NOT_MARKED"} />,
                },
              ]}
              getKey={(record) => record.sessionId}
              getMobileTitle={(record) => record.title}
              getMobileSubtitle={(record) => `${record.batchName} | ${new Date(record.date).toLocaleDateString()}`}
              getMobileMeta={(record) => <StatusBadge label={record.status ?? "NOT_MARKED"} />}
              emptyTitle="No attendance records found"
              emptyDescription="Adjust search or filters."
            />
          </div>
        ) : null}
        {studentAttendanceQuery.data ? (
          <PaginationControls pagination={studentAttendanceQuery.data.pagination} onPageChange={setAttendancePage} />
        ) : null}
      </Card>

      <ReportCard
        id="reports"
        title="Operational Reports"
        subtitle="Export full filtered attendance history."
      >
        <ExportButton
          label="Export Student Attendance CSV"
          isLoading={exportReportMutation.isPending}
          onClick={() => exportReportMutation.mutate()}
        />
      </ReportCard>
    </div>
  );
};

export { StudentDashboardPage };
