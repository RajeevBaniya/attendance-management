import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { getInstitutions } from "../../api/institutionsApi";
import { InlineError } from "../feedback/inlineError";
import { SuccessState } from "../feedback/successState";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import type { InstitutionOption } from "../../types/institutionTypes";

type CreateInstitutionAdminFormValues = {
  institutionId: string;
  name: string;
  email: string;
  password: string;
};

type CreateInstitutionAdminFormProps = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSubmit: (values: CreateInstitutionAdminFormValues) => void;
};

const CreateInstitutionAdminForm = ({
  isSubmitting,
  errorMessage,
  successMessage,
  onSubmit,
}: CreateInstitutionAdminFormProps) => {
  const [institutionId, setInstitutionId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const institutionsQuery = useQuery({
    queryKey: ["institutions", "super-admin"],
    queryFn: getInstitutions,
  });
  const institutions = useMemo<InstitutionOption[]>(() => {
    return institutionsQuery.data ?? [];
  }, [institutionsQuery.data]);
  const hasInstitutions = institutions.length > 0;
  const shouldDisableInputs = isSubmitting || institutionsQuery.isLoading || !hasInstitutions;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInstitutionId = institutionId.trim();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedInstitutionId || !trimmedName || !trimmedEmail || !password) {
      setLocalError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    setLocalError(null);
    onSubmit({
      institutionId: trimmedInstitutionId,
      name: trimmedName,
      email: trimmedEmail,
      password,
    });
  };

  const handleReset = () => {
    setInstitutionId("");
    setName("");
    setEmail("");
    setPassword("");
    setLocalError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="institutionId" className="field-label">
          Institution
        </label>
        <Select
          id="institutionId"
          value={institutionId}
          onChange={(event) => setInstitutionId(event.target.value)}
          disabled={shouldDisableInputs}
        >
          <option value="">
            {institutionsQuery.isLoading ? "Loading institutions..." : "Select institution"}
          </option>
          {institutions.map((institution) => (
            <option key={institution.id} value={institution.id}>
              {institution.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="adminName" className="field-label">
          Admin name
        </label>
        <Input
          id="adminName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter admin name"
          disabled={shouldDisableInputs}
        />
      </div>

      <div>
        <label htmlFor="adminEmail" className="field-label">
          Admin email
        </label>
        <Input
          id="adminEmail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          disabled={shouldDisableInputs}
        />
      </div>

      <div>
        <label htmlFor="adminPassword" className="field-label">
          Password
        </label>
        <Input
          id="adminPassword"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          disabled={shouldDisableInputs}
        />
      </div>

      <InlineError message={institutionsQuery.isError ? "Unable to load institutions. Please try again." : null} />
      {!institutionsQuery.isLoading && !hasInstitutions ? (
        <p className="text-sm text-amber-700">
          No institutions available. Create an institution first to enable admin creation.
        </p>
      ) : null}
      <InlineError message={localError} />
      <InlineError message={errorMessage} />
      <SuccessState message={successMessage} />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting} disabled={shouldDisableInputs}>
          {isSubmitting ? "Creating..." : "Create institution admin"}
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset} disabled={shouldDisableInputs}>
          Reset
        </Button>
      </div>
    </form>
  );
};

export { CreateInstitutionAdminForm };
export type { CreateInstitutionAdminFormValues };
