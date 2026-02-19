import { useState } from 'react';
import NoEnumeratorImage from '../../assets/no-enumerator.png'
import './enumerator.css'
import { Eye, Search } from 'lucide-react';
import Progress from '../../Components/Progress/progress';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Components/Pagination/pagination';
import Table from '../../Components/Table/table';
import TableToolbar from '../../Components/Table/TableToolbar/tableToolbar';
import { NoDataEmptyState, NoSearchResultsEmptyState } from '../../Components/EmptyState/emptyState';
import { enumeratorData } from '../../constants/enumeratorData';

export const Enumerators = () => {

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ survey: "" });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;
  
  const filteredEnumerators = enumeratorData.filter((e) => {
    const matchesSearch =  e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());  
    const matchesSurvey = !filters.survey || e.survey === filters.survey; 
    return matchesSearch && matchesSurvey;
  });

  const totalPages = Math.ceil(filteredEnumerators.length / pageSize);
  const paginatedData = filteredEnumerators.slice(
    (page - 1) * pageSize, page * pageSize
  );

  const enumeratorColumns = [
    { key: "id", label: "Enumerator ID" },
    { key: "name", label: "Enumerator Name" },
    { key: "survey", label: "Survey" },
    {
      key: "progress",
      label: "Progress",
      render: (_, row) => (
        <Progress
          current={row.completed}
          total={row.total}
        />
      ),
    }
  ];

  const uniqueSurveys = [...new Set(enumeratorData.map(e => e.survey))];
  const filterOptions = [
    {
      name: "survey",
      options: [
        { label: "All Surveys", value: "" },
        ...uniqueSurveys.map(survey => ({ label: survey, value: survey }))
      ],
    },
  ];
  
  return (
    <div className="enumerators-page">
      <div>
        <h1 className='enumerator-container-title'>Enumerator Management & Field Tracking</h1>
        <p className='enumerator-container-description'>Real-time monitoring and management of field enumerators</p>
      </div>

      {enumeratorData.length != 0 && (
        <div style={{marginBottom: "16px"}}>
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
        </div>
      )}

      {enumeratorData.length === 0 ? (
        <NoDataEmptyState
          image={NoEnumeratorImage}
          title="No enumerators found"
          message="There are no enumerators in the system yet."
          suggestion="Enumerators will appear here once they are assigned to surveys."
        />
      ) : (
        <>
          {filteredEnumerators.length === 0 ? (
            <NoSearchResultsEmptyState
              searchTerm={search}
              icon={<Search/>}
              title="No matching enumerators"
              message="We couldn't find any enumerators matching"
              suggestion="Try checking your spelling or using different filters"
              {...(filters.survey && {
                filterName: "survey",
                filterValue: filters.survey
              })}
            />
          ) : (
            <>
              <Table
                columns={enumeratorColumns}
                data={paginatedData}
                renderActions={(row) => (
                  <button
                    style={{border:"none", backgroundColor:"transparent", cursor:"pointer"}}
                    onClick={() => navigate(`/dashboard/enumerators/${row.id}`)}
                  >
                    <Eye size={18} />
                  </button>
                )}
              />

              {filteredEnumerators.length > 0 && (
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
}
