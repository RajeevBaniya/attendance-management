type SuccessStateProps = {
  message: string | null;
};

const SuccessState = ({ message }: SuccessStateProps) => {
  if (!message) {
    return null;
  }

  return (
    <p role="status" aria-live="polite" className="text-sm text-emerald-200">
      {message}
    </p>
  );
};

export { SuccessState };
export type { SuccessStateProps };
