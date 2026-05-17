import { Card } from "../ui/card";
import type { AttendanceMetrics } from "../../types/analyticsTypes";

type AttendanceOverviewProps = {
  title: string;
  subtitle: string;
  metrics: AttendanceMetrics;
};

const AttendanceOverview = ({ title, subtitle, metrics }: AttendanceOverviewProps) => {
  const totalRecords = metrics.presentCount + metrics.absentCount;

  return (
    <Card className="p-4 sm:p-5">
      <p className="text-sm font-semibold tracking-tight text-slate-100">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <p className="text-xs text-slate-400">Present</p>
          <p className="mt-1 text-lg font-semibold text-emerald-200">{metrics.presentCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <p className="text-xs text-slate-400">Absent</p>
          <p className="mt-1 text-lg font-semibold text-rose-200">{metrics.absentCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <p className="text-xs text-slate-400">Attendance Rate</p>
          <p className="mt-1 text-lg font-semibold text-cyan-200">{metrics.attendancePercentage.toFixed(2)}%</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">Based on {totalRecords} attendance records.</p>
    </Card>
  );
};

export { AttendanceOverview };
export type { AttendanceOverviewProps };
