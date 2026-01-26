import "./tableToolbar.css";
import FormInput from "../../FormInput/FormInput";

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
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          otherStyles={{ width: "100%", backgroundColor: "#f1f7fc", borderRadius: "35px"}}
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
            otherStyles={{ width: "100%", backgroundColor: "#f1f7fc", borderRadius: "35px" }}
          />
        ))}
      </div>
    </div>
  );
}
