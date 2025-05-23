import { useState } from "react";

type Suggestion = {
  label: string;
  value: string | number;
};

interface ChangeEvent {
  target: {
    value: string;
  };
}

interface AutocompleteInputProps {
  suggestions: Suggestion[];
  change?: (value: string | number) => void;
}

export function AutocompleteInput({
  suggestions,
  change,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    [],
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: ChangeEvent): void => {
    const value: string = e.target.value;
    setInputValue(value);
    const filtered = suggestions.filter((sug) =>
      sug.label.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelect = (suggestion: Suggestion) => {
    setInputValue(suggestion.label);
    if (change) change(suggestion.value);
    setShowSuggestions(false);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleChange} />
      {showSuggestions && (
        <ul>
          {filteredSuggestions.map((sug, idx) => (
            <li key={idx} onClick={() => handleSelect(sug)}>
              {sug.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
