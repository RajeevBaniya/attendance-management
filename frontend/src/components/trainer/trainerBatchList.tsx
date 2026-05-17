import type { TrainerBatch } from "../../types/sessionTypes";

type TrainerBatchListProps = {
  batches: TrainerBatch[];
  isLoading: boolean;
  isError: boolean;
};

const TrainerBatchList = ({ batches, isLoading, isError }: TrainerBatchListProps) => {
  if (isLoading) {
    return <p className="muted-text">Loading assigned batches...</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Unable to load assigned batches.</p>;
  }

  if (batches.length === 0) {
    return <p className="muted-text">No assigned batches found.</p>;
  }

  return (
    <div className="space-y-2">
      {batches.map((batch) => (
        <article key={batch.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-100">
          <p className="break-words">{batch.name}</p>
        </article>
      ))}
    </div>
  );
};

export { TrainerBatchList };
