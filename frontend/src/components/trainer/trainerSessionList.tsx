import type { TrainerSessionRecord } from "../../types/sessionTypes";

type TrainerSessionListProps = {
  sessions: TrainerSessionRecord[];
  selectedSessionId: string | null;
  isLoading: boolean;
  isError: boolean;
  onSelectSession: (sessionId: string) => void;
};

const TrainerSessionList = ({
  sessions,
  selectedSessionId,
  isLoading,
  isError,
  onSelectSession,
}: TrainerSessionListProps) => {
  if (isLoading) {
    return <p className="muted-text">Loading sessions...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Unable to load sessions.</p>;
  }

  if (sessions.length === 0) {
    return <p className="muted-text">No sessions found.</p>;
  }

  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <button
          type="button"
          key={session.id}
          onClick={() => onSelectSession(session.id)}
          className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
            selectedSessionId === session.id
              ? "border-indigo-400/40 bg-indigo-500/10 text-slate-100"
              : "border-slate-800 bg-slate-900/70 text-slate-100 hover:bg-slate-800/70"
          }`}
        >
          <p className="break-words font-medium">{session.title}</p>
          <p className={selectedSessionId === session.id ? "text-slate-300" : "text-slate-400"}>
            {session.batchName} | {new Date(session.sessionDate).toLocaleDateString()}
          </p>
        </button>
      ))}
    </div>
  );
};

export { TrainerSessionList };
