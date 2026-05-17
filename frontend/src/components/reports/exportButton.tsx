import { Button } from "../ui/button";

type ExportButtonProps = {
  label: string;
  isLoading: boolean;
  onClick: () => void;
};

const ExportButton = ({ label, isLoading, onClick }: ExportButtonProps) => {
  return (
    <Button variant="secondary" isLoading={isLoading} onClick={onClick}>
      {isLoading ? "Exporting..." : label}
    </Button>
  );
};

export { ExportButton };
export type { ExportButtonProps };
