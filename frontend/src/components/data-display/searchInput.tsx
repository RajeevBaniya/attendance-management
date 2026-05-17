import { Input } from "../ui/input";

type SearchInputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
};

const SearchInput = ({ value, placeholder, onChange, ariaLabel }: SearchInputProps) => {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      className="h-10"
    />
  );
};

export { SearchInput };
export type { SearchInputProps };
