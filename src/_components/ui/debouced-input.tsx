import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./input";

export default function DebouncedInput({
  value: initialValue, // alias name
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  // init the initial state of input at page load
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    // <div className="w-max-50 mr-2 shadow-lg">
    <div className="relative rounded-full shadow-lg">
      <SearchIcon className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9"
        type="text"
        placeholder="Make better ..."
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>

    // </div>
  );
}
