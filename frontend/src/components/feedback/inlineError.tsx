type InlineErrorProps = {
  message: string | null;
};

const InlineError = ({ message }: InlineErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" aria-live="assertive" className="text-sm text-rose-200">
      {message}
    </p>
  );
};

export { InlineError };
export type { InlineErrorProps };
