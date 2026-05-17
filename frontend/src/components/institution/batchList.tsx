import type { Batch } from "../../types/batchTypes";

type BatchListProps = {
  batches: Batch[];
  isLoading: boolean;
  isError: boolean;
};

const BatchList = ({ batches, isLoading, isError }: BatchListProps) => {
  if (isLoading) {
    return <p className="muted-text">Loading batches...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Unable to load batches.</p>;
  }

  if (batches.length === 0) {
    return <p className="muted-text">No batches found.</p>;
  }

  return (
    <div className="space-y-3">
      {batches.map((batch) => (
        <article key={batch.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm font-semibold text-slate-100">{batch.name}</p>
          <p className="text-xs text-slate-400">Created: {new Date(batch.createdAt).toLocaleString()}</p>
          <div className="mt-2 flex gap-4 text-xs text-slate-300">
            <span>Trainers: {batch.trainerCount}</span>
            <span>Students: {batch.studentCount}</span>
          </div>
        </article>
      ))}
    </div>
  );
};

export { BatchList };
