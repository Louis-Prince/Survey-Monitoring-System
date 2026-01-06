import "./tableToolbar.css";
import FormInput from "../../FormInput/FormInput";
import { Search } from "lucide-react";

export default function TableToolbar({
  searchValue,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
}) {
  return (
    <div className="table-toolbar">
      <div className="toolbar-left">
        <FormInput
          type="text"
          placeholder="Search by name or email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search size={18} />}
          otherStyles={{
            width: "100%",
            backgroundColor: "#f8fafc",
            borderRadius: "35px",
            padding: "12px 16px",
          }}
        />
      </div>

      <div className="toolbar-right">
        {filters.map((filter) => (
          <FormInput
            key={filter.name}
            type="select"
            label={filter.label}
            name={filter.name}
            value={filterValues[filter.name] || ""}
            options={filter.options}
            onChange={(e) =>
              onFilterChange(filter.name, e.target.value)
            }
            otherStyles={{
              width: "100%",
              backgroundColor: "#f8fafc",
              borderRadius: "35px",
              padding: "12px 16px",
            }}
          />
        ))}
      </div>
    </div>
  );
}