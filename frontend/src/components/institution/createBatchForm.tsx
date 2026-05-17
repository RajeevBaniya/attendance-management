import { useState } from "react";
import type { FormEvent } from "react";

import { InlineError } from "../feedback/inlineError";
import { SuccessState } from "../feedback/successState";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type CreateBatchFormValues = {
  name: string;
};

type CreateBatchFormProps = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSubmit: (values: CreateBatchFormValues) => void;
};

const CreateBatchForm = ({ isSubmitting, errorMessage, successMessage, onSubmit }: CreateBatchFormProps) => {
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setLocalError("Batch name is required");
      return;
    }

    setLocalError(null);
    onSubmit({ name: trimmedName });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="batchName" className="field-label">
          Batch name
        </label>
        <Input
          id="batchName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter batch name"
          disabled={isSubmitting}
        />
      </div>
      <InlineError message={localError} />
      <InlineError message={errorMessage} />
      <SuccessState message={successMessage} />
      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create batch"}
      </Button>
    </form>
  );
};

export { CreateBatchForm };
export type { CreateBatchFormValues };
