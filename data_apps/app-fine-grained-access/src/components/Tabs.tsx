type Option<T extends string> = { value: T; label: string };

type ControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

// The two screens at the top: an underlined tab bar.
export function TabBar<T extends string>({
  options,
  value,
  onChange,
}: ControlProps<T>) {
  return (
    <div role="tablist" className="tabs">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          className="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// The perspective switch inside a tab: a pill toggle.
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: ControlProps<T>) {
  return (
    <div role="group" className="segmented">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
