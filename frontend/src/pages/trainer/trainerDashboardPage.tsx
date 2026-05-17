import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { getSessionAttendance, markAttendance } from "../../api/attendanceApi";
import { generateInvite } from "../../api/invitesApi";
import { exportTrainerAttendanceReport, triggerCsvDownload } from "../../api/reportsApi";
import { createSession, getTrainerBatches, getTrainerSessions } from "../../api/sessionsApi";
import { DataTable } from "../../components/data-display/dataTable";
import { FilterSelect } from "../../components/data-display/filterSelect";
import { PaginationControls } from "../../components/data-display/paginationControls";
import { SearchInput } from "../../components/data-display/searchInput";
import { StatusBadge } from "../../components/data-display/statusBadge";
import { InlineError } from "../../components/feedback/inlineError";
import { LoadingState } from "../../components/feedback/loadingState";
import { CreateSessionForm } from "../../components/trainer/createSessionForm";
import { GenerateInviteForm } from "../../components/trainer/generateInviteForm";
import { TrainerBatchList } from "../../components/trainer/trainerBatchList";
import { ExportButton } from "../../components/reports/exportButton";
import { ReportCard } from "../../components/reports/reportCard";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { SectionHeader } from "../../components/ui/sectionHeader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useNotification } from "../../hooks/useNotification";
import { matchesDatePreset, matchesSearch } from "../../utils/dataFilters";
import type { AttendanceStatus } from "../../types/attendanceTypes";
import type { GenerateInviteFormValues } from "../../components/trainer/generateInviteForm";
import type { CreateSessionFormValues } from "../../components/trainer/createSessionForm";
import type { DatePresetFilter } from "../../utils/dataFilters";
import type { AttendanceStatusFilter } from "../../types/reportTypes";

const TrainerDashboardPage = () => {
  const PAGE_LIMIT = 10;
  const { backendUser } = useAuthContext();
  const { notifyError, notifySuccess } = useNotification();
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);
  const [attendanceSuccess, setAttendanceSuccess] = useState<string | null>(null);
  const [markingKey, setMarkingKey] = useState<string | null>(null);
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionDateFilter, setSessionDateFilter] = useState<DatePresetFilter>("ALL");
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [batchPage, setBatchPage] = useState(1);
  const [sessionPage, setSessionPage] = useState(1);
  const [reportStatusFilter, setReportStatusFilter] = useState<AttendanceStatusFilter>("ALL");
  const debouncedSessionSearch = useDebouncedValue(sessionSearch, 300);
  const debouncedAttendanceSearch = useDebouncedValue(attendanceSearch, 300);
  const batchesQuery = useQuery({
    queryKey: ["trainer-batches", batchPage, PAGE_LIMIT],
    queryFn: () => getTrainerBatches({ page: batchPage, limit: PAGE_LIMIT }),
  });
  const sessionsQuery = useQuery({
    queryKey: ["trainer-sessions", sessionPage, PAGE_LIMIT],
    queryFn: () => getTrainerSessions({ page: sessionPage, limit: PAGE_LIMIT }),
  });
  const sessionAttendanceQuery = useQuery({
    queryKey: ["session-attendance", selectedSessionId],
    queryFn: () => getSessionAttendance(selectedSessionId as string),
    enabled: selectedSessionId !== null,
  });
  const batches = useMemo(() => batchesQuery.data?.items ?? [], [batchesQuery.data?.items]);
  const sessions = useMemo(() => {
    return (
      (sessionsQuery.data?.items ?? [])
        .filter((session) => matchesSearch(session.title, debouncedSessionSearch))
        .filter((session) => matchesDatePreset(session.sessionDate, sessionDateFilter))
        .toSorted(
          (first, second) => new Date(second.sessionDate).getTime() - new Date(first.sessionDate).getTime(),
        )
    );
  }, [debouncedSessionSearch, sessionDateFilter, sessionsQuery.data?.items]);
  const filteredStudents = useMemo(() => {
    return (
      sessionAttendanceQuery.data?.students.filter((student) =>
        matchesSearch(student.studentName, debouncedAttendanceSearch),
      ) ?? []
    );
  }, [debouncedAttendanceSearch, sessionAttendanceQuery.data?.students]);
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      setSessionError(null);
      setSessionSuccess("Session created successfully.");
      notifySuccess("Session created", "New training session is now available.");
    },
    onError: (error) => {
      setSessionSuccess(null);
      setSessionError(error.message);
      notifyError("Session creation failed", error.message);
    },
  });
  const generateInviteMutation = useMutation({
    mutationFn: ({ batchId }: GenerateInviteFormValues) => generateInvite(batchId),
    onSuccess: (invite) => {
      setInviteError(null);
      setGeneratedToken(invite.token);
      setGeneratedLink(`${window.location.origin}/student?token=${invite.token}`);
      notifySuccess("Invite generated", "Share token or link with students.");
    },
    onError: (error) => {
      setGeneratedToken(null);
      setGeneratedLink(null);
      setInviteError(error.message);
      notifyError("Invite generation failed", error.message);
    },
  });
  const markAttendanceMutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: async () => {
      setAttendanceError(null);
      setAttendanceSuccess("Attendance updated.");
      notifySuccess("Attendance updated", "Student attendance status saved.");
      await sessionAttendanceQuery.refetch();
    },
    onError: (error) => {
      setAttendanceSuccess(null);
      setAttendanceError(error.message);
      notifyError("Attendance update failed", error.message);
    },
    onSettled: () => {
      setMarkingKey(null);
    },
  });
  const exportReportMutation = useMutation({
    mutationFn: async () => {
      const file = await exportTrainerAttendanceReport({
        datePreset: sessionDateFilter,
        status: reportStatusFilter,
        sessionId: selectedSessionId ?? undefined,
        search: sessionSearch || undefined,
      });
      triggerCsvDownload(file);
    },
    onSuccess: () => {
      notifySuccess("Report exported", "Trainer attendance report CSV downloaded.");
    },
    onError: (error) => {
      notifyError("Report export failed", error.message);
    },
  });

  const handleCreateSession = (values: CreateSessionFormValues) => {
    setSessionSuccess(null);
    setSessionError(null);
    createSessionMutation.mutate(values);
  };

  const handleGenerateInvite = (values: GenerateInviteFormValues) => {
    setInviteError(null);
    setGeneratedToken(null);
    setGeneratedLink(null);
    generateInviteMutation.mutate(values);
  };

  const handleMarkAttendance = (studentId: string, status: AttendanceStatus) => {
    if (!selectedSessionId) {
      return;
    }

    setAttendanceError(null);
    setAttendanceSuccess(null);
    setMarkingKey(`${studentId}:${status}`);
    markAttendanceMutation.mutate({
      sessionId: selectedSessionId,
      studentId,
      status,
    });
  };

  return (
    <div className="space-y-6">
      <Card id="overview" className="scroll-mt-24">
        <SectionHeader title="Trainer Dashboard" subtitle="Sessions, attendance and invite workflows." />
        <p className="body-text">Role: {backendUser?.role ?? "Unknown"}</p>
        <p className="muted-text mt-1">User: {backendUser?.email ?? "Unknown"}</p>
      </Card>

      <Card>
        <SectionHeader title="Assigned Batches" />
        <div className="mt-4">
          <TrainerBatchList batches={batches} isLoading={batchesQuery.isLoading} isError={batchesQuery.isError} />
          {batchesQuery.data ? (
            <PaginationControls pagination={batchesQuery.data.pagination} onPageChange={setBatchPage} />
          ) : null}
        </div>
      </Card>

      <Card id="sessions" className="scroll-mt-24">
        <SectionHeader title="Create Session" />
        <div className="mt-4">
          <CreateSessionForm
            batches={batches}
            isLoadingBatches={batchesQuery.isLoading}
            isSubmitting={createSessionMutation.isPending}
            errorMessage={sessionError}
            successMessage={sessionSuccess}
            onSubmit={handleCreateSession}
          />
        </div>
      </Card>

      <Card id="invites" className="scroll-mt-24">
        <SectionHeader title="Generate Invite" />
        <div className="mt-4">
          <GenerateInviteForm
            batches={batches}
            isLoadingBatches={batchesQuery.isLoading}
            isSubmitting={generateInviteMutation.isPending}
            errorMessage={inviteError}
            generatedToken={generatedToken}
            generatedLink={generatedLink}
            onSubmit={handleGenerateInvite}
          />
        </div>
      </Card>

      <Card className="scroll-mt-24">
        <SectionHeader title="Sessions" />
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SearchInput value={sessionSearch} placeholder="Search by session title" onChange={setSessionSearch} />
            <FilterSelect
              value={sessionDateFilter}
              options={[
                { value: "ALL", label: "All dates" },
                { value: "TODAY", label: "Today" },
                { value: "LAST_7_DAYS", label: "Last 7 days" },
                { value: "LAST_30_DAYS", label: "Last 30 days" },
              ]}
              onChange={(value) => setSessionDateFilter(value as DatePresetFilter)}
            />
          </div>
          {sessionsQuery.isLoading ? <LoadingState label="Loading sessions..." /> : null}
          <InlineError message={sessionsQuery.isError ? "Unable to load sessions." : null} />
          {!sessionsQuery.isLoading && !sessionsQuery.isError ? (
            <DataTable
              data={sessions}
              columns={[
                {
                  id: "title",
                  label: "Session",
                  renderCell: (session) => (
                    <button
                      type="button"
                      onClick={() => setSelectedSessionId(session.id)}
                      className="text-left text-sm font-medium text-slate-100 underline-offset-2 hover:text-indigo-200 hover:underline"
                    >
                      {session.title}
                    </button>
                  ),
                },
                {
                  id: "batch",
                  label: "Batch",
                  renderCell: (session) => <span>{session.batchName}</span>,
                },
                {
                  id: "date",
                  label: "Date",
                  renderCell: (session) => (
                    <span className="text-xs text-slate-400">{new Date(session.sessionDate).toLocaleDateString()}</span>
                  ),
                },
                {
                  id: "time",
                  label: "Time",
                  renderCell: (session) => (
                    <span className="text-xs text-slate-300">
                      {session.startTime} - {session.endTime}
                    </span>
                  ),
                },
              ]}
              getKey={(session) => session.id}
              getMobileTitle={(session) => session.title}
              getMobileSubtitle={(session) => `${session.batchName} | ${new Date(session.sessionDate).toLocaleDateString()}`}
              getMobileMeta={(session) => (
                <>
                  <StatusBadge label={`${session.startTime} - ${session.endTime}`} variant="info" />
                  <Button size="sm" variant="secondary" onClick={() => setSelectedSessionId(session.id)}>
                    Select
                  </Button>
                </>
              )}
              emptyTitle="No sessions found"
              emptyDescription="Adjust search or date filter."
            />
          ) : null}
          {sessionsQuery.data ? (
            <PaginationControls pagination={sessionsQuery.data.pagination} onPageChange={setSessionPage} />
          ) : null}
        </div>
      </Card>

      <Card id="attendance" className="scroll-mt-24">
        <SectionHeader title="Attendance Panel" />
        {!selectedSessionId ? <p className="mt-3 muted-text">Select a session to mark attendance.</p> : null}
        <InlineError message={attendanceError} />
        {attendanceSuccess ? <p className="mt-3 text-sm text-emerald-700">{attendanceSuccess}</p> : null}
        {selectedSessionId ? (
          <div className="mt-4 space-y-3">
            <SearchInput
              value={attendanceSearch}
              placeholder="Search student by name"
              onChange={setAttendanceSearch}
            />
            {sessionAttendanceQuery.isLoading ? <LoadingState label="Loading session attendance..." /> : null}
            <InlineError message={sessionAttendanceQuery.isError ? "Unable to load session attendance." : null} />
            {!sessionAttendanceQuery.isLoading && !sessionAttendanceQuery.isError ? (
              <DataTable
                data={filteredStudents}
                columns={[
                  {
                    id: "student",
                    label: "Student",
                    renderCell: (student) => <span className="font-medium text-slate-100">{student.studentName}</span>,
                  },
                  {
                    id: "status",
                    label: "Status",
                    renderCell: (student) => <StatusBadge label={student.status ?? "NOT_MARKED"} />,
                  },
                  {
                    id: "present",
                    label: "Present",
                    renderCell: (student) => {
                      const presentKey = `${student.studentId}:PRESENT`;
                      return (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkAttendance(student.studentId, "PRESENT")}
                          disabled={markingKey !== null}
                          className="w-full"
                        >
                          {markingKey === presentKey ? "Saving..." : "Mark Present"}
                        </Button>
                      );
                    },
                  },
                  {
                    id: "absent",
                    label: "Absent",
                    renderCell: (student) => {
                      const absentKey = `${student.studentId}:ABSENT`;
                      return (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleMarkAttendance(student.studentId, "ABSENT")}
                          disabled={markingKey !== null}
                          className="w-full"
                        >
                          {markingKey === absentKey ? "Saving..." : "Mark Absent"}
                        </Button>
                      );
                    },
                  },
                ]}
                getKey={(student) => student.studentId}
                getMobileTitle={(student) => student.studentName}
                getMobileSubtitle={(student) => `Status: ${student.status ?? "NOT_MARKED"}`}
                getMobileMeta={(student) => (
                  <>
                    <StatusBadge label={student.status ?? "NOT_MARKED"} />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMarkAttendance(student.studentId, "PRESENT")}
                      disabled={markingKey !== null}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleMarkAttendance(student.studentId, "ABSENT")}
                      disabled={markingKey !== null}
                    >
                      Absent
                    </Button>
                  </>
                )}
                emptyTitle="No students found"
                emptyDescription="Adjust search or select a different session."
              />
            ) : null}
          </div>
        ) : null}
      </Card>

      <ReportCard
        id="reports"
        title="Operational Reports"
        subtitle="Export trainer attendance records with current filters."
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
            value={selectedSessionId ?? ""}
            options={[
              { value: "", label: "All sessions" },
              ...sessions.map((session) => ({ value: session.id, label: session.title })),
            ]}
            onChange={(value) => setSelectedSessionId(value || null)}
          />
        </div>
        <ExportButton
          label="Export Trainer Attendance CSV"
          isLoading={exportReportMutation.isPending}
          onClick={() => exportReportMutation.mutate()}
        />
      </ReportCard>
    </div>
  );
};

export { TrainerDashboardPage };
