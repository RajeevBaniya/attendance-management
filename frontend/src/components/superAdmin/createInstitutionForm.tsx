import { useState } from "react";
import type { FormEvent } from "react";

import { InlineError } from "../feedback/inlineError";
import { SuccessState } from "../feedback/successState";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type CreateInstitutionFormValues = {
  name: string;
};

type CreateInstitutionFormProps = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSubmit: (values: CreateInstitutionFormValues) => void;
};

const CreateInstitutionForm = ({
  isSubmitting,
  errorMessage,
  successMessage,
  onSubmit,
}: CreateInstitutionFormProps) => {
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setLocalError("Institution name is required");
      return;
    }

    setLocalError(null);
    onSubmit({ name: trimmedName });
  };

  const handleReset = () => {
    setName("");
    setLocalError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="institutionName" className="field-label">
          Institution name
        </label>
        <Input
          id="institutionName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter institution name"
          disabled={isSubmitting}
        />
      </div>

      <InlineError message={localError} />
      <InlineError message={errorMessage} />
      <SuccessState message={successMessage} />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create institution"}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset} disabled={isSubmitting}>
          Reset
        </Button>
      </div>
    </form>
  );
};

export { CreateInstitutionForm };
export type { CreateInstitutionFormValues };
