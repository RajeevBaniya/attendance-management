import { useState } from "react";
import type { FormEvent } from "react";

import { InlineError } from "../feedback/inlineError";
import { SuccessState } from "../feedback/successState";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import type { Batch } from "../../types/batchTypes";
import type { InstitutionTrainer } from "../../types/institutionTypes";

type AssignTrainerFormValues = {
  batchId: string;
  trainerId: string;
};

type AssignTrainerFormProps = {
  batches: Batch[];
  trainers: InstitutionTrainer[];
  isSubmitting: boolean;
  isLoadingOptions: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSubmit: (values: AssignTrainerFormValues) => void;
};

const AssignTrainerForm = ({
  batches,
  trainers,
  isSubmitting,
  isLoadingOptions,
  errorMessage,
  successMessage,
  onSubmit,
}: AssignTrainerFormProps) => {
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const canSubmit = !isLoadingOptions && batches.length > 0 && trainers.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedBatchId || !selectedTrainerId) {
      setLocalError("Select both batch and trainer");
      return;
    }

    setLocalError(null);
    onSubmit({ batchId: selectedBatchId, trainerId: selectedTrainerId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="batchSelect" className="field-label">
          Batch
        </label>
        <Select
          id="batchSelect"
          value={selectedBatchId}
          onChange={(event) => setSelectedBatchId(event.target.value)}
          disabled={isSubmitting || isLoadingOptions || batches.length === 0}
        >
          <option value="">{isLoadingOptions ? "Loading batches..." : "Select batch"}</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="trainerSelect" className="field-label">
          Trainer
        </label>
        <Select
          id="trainerSelect"
          value={selectedTrainerId}
          onChange={(event) => setSelectedTrainerId(event.target.value)}
          disabled={isSubmitting || isLoadingOptions || trainers.length === 0}
        >
          <option value="">{isLoadingOptions ? "Loading trainers..." : "Select trainer"}</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name} ({trainer.email ?? "No email"})
            </option>
          ))}
        </Select>
      </div>

      {!isLoadingOptions && batches.length === 0 ? (
        <p className="text-sm text-amber-700">Create a batch first before assigning trainers.</p>
      ) : null}
      {!isLoadingOptions && trainers.length === 0 ? (
        <p className="text-sm text-amber-700">No institution trainers available for assignment.</p>
      ) : null}
      <InlineError message={localError} />
      <InlineError message={errorMessage} />
      <SuccessState message={successMessage} />

      <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
        {isSubmitting ? "Assigning..." : "Assign trainer"}
      </Button>
    </form>
  );
};

export { AssignTrainerForm };
export type { AssignTrainerFormValues };
