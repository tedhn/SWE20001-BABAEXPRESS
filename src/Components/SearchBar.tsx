import { TextInput, Button } from "@mantine/core";
import { FC, useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  useEffect(() => onSearch(query), [query]);

  return (
    <div className="flex items-center justify-center p-8 w-full">
      <TextInput
        placeholder="Search..."
        classNames={{
          input:
            "border-2 border-gray-300 rounded-lg focus:border-[#3b82f6] grow",
        }}
        className="w-full grow"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button className="ml-2 w-24" color="#3b82f6">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
