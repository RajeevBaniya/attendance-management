import { useState } from "react";
import type { FormEvent } from "react";

import { InlineError } from "../feedback/inlineError";
import { SuccessState } from "../feedback/successState";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import type { TrainerBatch } from "../../types/sessionTypes";

type CreateSessionFormValues = {
  batchId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
};

type CreateSessionFormProps = {
  batches: TrainerBatch[];
  isLoadingBatches: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSubmit: (values: CreateSessionFormValues) => void;
};

const CreateSessionForm = ({
  batches,
  isLoadingBatches,
  isSubmitting,
  errorMessage,
  successMessage,
  onSubmit,
}: CreateSessionFormProps) => {
  const [batchId, setBatchId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!batchId || !title.trim() || !date || !startTime || !endTime) {
      setLocalError("All fields are required");
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}:00.000Z`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}:00.000Z`).toISOString();
    const sessionDate = new Date(`${date}T00:00:00.000Z`).toISOString();

    if (new Date(startDateTime).getTime() >= new Date(endDateTime).getTime()) {
      setLocalError("End time must be after start time");
      return;
    }

    setLocalError(null);
    onSubmit({
      batchId,
      title: title.trim(),
      date: sessionDate,
      startTime: startDateTime,
      endTime: endDateTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sessionBatch" className="field-label">
          Batch
        </label>
        <Select
          id="sessionBatch"
          value={batchId}
          onChange={(event) => setBatchId(event.target.value)}
          disabled={isSubmitting || isLoadingBatches || batches.length === 0}
        >
          <option value="">{isLoadingBatches ? "Loading batches..." : "Select batch"}</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label htmlFor="sessionTitle" className="field-label">
          Session title
        </label>
        <Input
          id="sessionTitle"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} disabled={isSubmitting} />
        <Input
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          disabled={isSubmitting}
        />
        <Input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} disabled={isSubmitting} />
      </div>
      <InlineError message={localError} />
      <InlineError message={errorMessage} />
      <SuccessState message={successMessage} />
      <Button type="submit" isLoading={isSubmitting} disabled={batches.length === 0}>
        {isSubmitting ? "Creating..." : "Create session"}
      </Button>
    </form>
  );
};

export { CreateSessionForm };
export type { CreateSessionFormValues };
