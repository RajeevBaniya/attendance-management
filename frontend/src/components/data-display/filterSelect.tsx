import { Select } from "../ui/select";

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
};

const FilterSelect = ({ value, options, onChange, ariaLabel }: FilterSelectProps) => {
  return (
    <Select
      value={value}
      aria-label={ariaLabel ?? "Filter options"}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      className="h-10"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export { FilterSelect };
export type { FilterOption, FilterSelectProps };
