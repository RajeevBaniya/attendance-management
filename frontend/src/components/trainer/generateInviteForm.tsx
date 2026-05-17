import { useState } from "react";
import type { FormEvent } from "react";

import { InlineError } from "../feedback/inlineError";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import type { TrainerBatch } from "../../types/sessionTypes";

type GenerateInviteFormValues = {
  batchId: string;
};

type GenerateInviteFormProps = {
  batches: TrainerBatch[];
  isLoadingBatches: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  generatedToken: string | null;
  generatedLink: string | null;
  onSubmit: (values: GenerateInviteFormValues) => void;
};

const GenerateInviteForm = ({
  batches,
  isLoadingBatches,
  isSubmitting,
  errorMessage,
  generatedToken,
  generatedLink,
  onSubmit,
}: GenerateInviteFormProps) => {
  const [batchId, setBatchId] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!batchId) {
      setLocalError("Select a batch first");
      return;
    }

    setLocalError(null);
    onSubmit({ batchId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="inviteBatch" className="field-label">
          Batch
        </label>
        <Select
          id="inviteBatch"
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
      <InlineError message={localError} />
      <InlineError message={errorMessage} />
      {generatedToken ? (
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3 text-sm text-cyan-100">
          <p>Token: {generatedToken}</p>
          {generatedLink ? <p className="mt-1 break-all">Invite link: {generatedLink}</p> : null}
        </div>
      ) : null}
      <Button type="submit" isLoading={isSubmitting} disabled={batches.length === 0}>
        {isSubmitting ? "Generating..." : "Generate invite"}
      </Button>
    </form>
  );
};

export { GenerateInviteForm };
export type { GenerateInviteFormValues };
