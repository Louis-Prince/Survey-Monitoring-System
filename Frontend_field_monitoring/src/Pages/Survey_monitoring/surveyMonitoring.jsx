import { useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Progress from "../../Components/Progress/progress";
import Pagination from "../../Components/Pagination/pagination";
import Table from "../../Components/Table/table";
import TableToolbar from "../../Components/Table/TableToolbar/tableToolbar";
import Button from "../../Components/Button/button";
import NoSurveyImage from "../../assets/no-enumerator.png";
import "./surveyMonitoring.css";
import { NoDataEmptyState, NoSearchResultsEmptyState } from "../../Components/EmptyState/emptyState";
import { surveyData } from "../../constants/surveyData";

export const SurveyMonitoring = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredSurveys = surveyData.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filters.status || s.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSurveys.length / pageSize);
  const paginatedData = filteredSurveys.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const surveyColumns = [
    { key: "id", label: "Survey ID" },
    { key: "name", label: "Survey Name" },
    {
      key: "status",
      label: "Status",
      render: (_, row) => (
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      render: (_, row) => (
        <Progress current={row.completed} total={row.total} />
      ),
    },
    { key: "period", label: "Period" },
  ];

  const uniqueStatuses = [...new Set(surveyData.map(s => s.status))]; 
  const filterOptions = [
    {
      name: "status",
      label: "Filter by Status",
      options: [
        { label: "All Statuses", value: "" },
        ...uniqueStatuses.map(status => ({ label: status, value: status }))
      ],
    },
  ];

  const handleAddSurvey = () => {
    navigate("/dashboard/surveys/create");
  };

  return (
    <div className="survey-monitoring-page">
      <div>
        <h1 className="survey-title">Survey Monitoring & Control</h1>
        <p className="survey-description">
          Manage and track all survey operations nationwide
        </p>
      </div>

      {surveyData.length != 0 && (
        <div className="survey-search-bar">
          <TableToolbar
            searchValue={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            filters={filterOptions}
            filterValues={filters}
            onFilterChange={(name, value) => {
              setFilters((prev) => ({ ...prev, [name]: value }));
              setPage(1);
            }}
          />
          <Button 
            text="Add Survey" 
            onClick={handleAddSurvey}
            icon={<Plus />} 
            iconPosition="left" 
            variant="primary"
          />
        </div>
      )}     

      {surveyData.length === 0 ? (
        <NoDataEmptyState
          image={NoSurveyImage}
          title="No surveys found"
          message="There are no surveys in the system yet."
          suggestion="Get started by creating your first survey."
          buttonText="Add Survey"
          onButtonClick={handleAddSurvey}
          buttonIcon={<Plus />}
        />
      ) : (
        <>
          {filteredSurveys.length === 0 ? (
            <NoSearchResultsEmptyState
              searchTerm={search}
              icon={<Search/>}
              title="No matching surveys"
              message="We couldn't find any surveys matching"
              suggestion="Try checking your spelling or using different filters"
              {...(filters.status && {
                filterName: "status",
                filterValue: filters.status
              })}
            />
          ) : (
            <>
              <Table
                columns={surveyColumns}
                data={paginatedData}
                renderActions={(row) => (
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/dashboard/surveys/${row.id}`)}
                  >
                    <Eye size={18} />
                  </button>
                )}
              />

              {filteredSurveys.length > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};