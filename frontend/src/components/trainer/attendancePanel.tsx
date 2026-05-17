import type { AttendanceStatus, SessionAttendanceStudent } from "../../types/attendanceTypes";

type AttendancePanelProps = {
  students: SessionAttendanceStudent[];
  isLoading: boolean;
  isError: boolean;
  markingKey: string | null;
  onMark: (studentId: string, status: AttendanceStatus) => void;
};

const AttendancePanel = ({ students, isLoading, isError, markingKey, onMark }: AttendancePanelProps) => {
  if (isLoading) {
    return <p className="muted-text">Loading session attendance...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Unable to load session attendance.</p>;
  }

  if (students.length === 0) {
    return <p className="muted-text">No students found in selected session.</p>;
  }

  return (
    <div className="space-y-3">
      {students.map((student) => {
        const presentKey = `${student.studentId}:PRESENT`;
        const absentKey = `${student.studentId}:ABSENT`;

        return (
          <article key={student.studentId} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-100">{student.studentName}</p>
                <p className="text-xs text-slate-400">Status: {student.status ?? "NOT_MARKED"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onMark(student.studentId, "PRESENT")}
                  disabled={markingKey !== null}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200 disabled:opacity-60"
                >
                  {markingKey === presentKey ? "Saving..." : "Present"}
                </button>
                <button
                  type="button"
                  onClick={() => onMark(student.studentId, "ABSENT")}
                  disabled={markingKey !== null}
                  className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200 disabled:opacity-60"
                >
                  {markingKey === absentKey ? "Saving..." : "Absent"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export { AttendancePanel };
