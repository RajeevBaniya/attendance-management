import { Button } from "../ui/button";
import type { PaginationMeta } from "../../types/paginationTypes";

type PaginationControlsProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
};

const PaginationControls = ({ pagination, onPageChange }: PaginationControlsProps) => {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs text-slate-400">
        Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} total)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export { PaginationControls };
export type { PaginationControlsProps };
