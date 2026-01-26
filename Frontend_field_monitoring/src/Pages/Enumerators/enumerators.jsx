import { useState } from 'react';
import NoEnumeratorImage from '../../assets/no-enumerator.png'
import './enumerator.css'
import { Eye } from 'lucide-react';
import Progress from '../../Components/Progress/progress';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Components/Pagination/pagination';
import Table from '../../Components/Table/table';
import TableToolbar from '../../Components/Table/TableToolbar/tableToolbar';

export const Enumerators = () => {

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ survey: "" });
  const navigate = useNavigate();

  const enumeratorData = [
    {
      id: "EN001",
      name: "MUGISHA Emma",
      survey: "SAS",
      completed: 140,
      total: 165,
    },
    {
      id: "EN002",
      name: "MATWI Alba",
      survey: "DHS",
      completed: 140,
      total: 165,
    },
    {
      id: 'EN003',
      name: 'Happy',
      survey: 'SAS',
      completed: 140,
      total: 165,
    },
    {
      id: "EN004",
      name: "MUGISHA Emma",
      survey: "SAS",
      completed: 140,
      total: 165,
    },
    {
      id: "EN005",
      name: "MATWI Alba",
      survey: "DHS",
      completed: 140,
      total: 165,
    },
    {
      id: 'EN006',
      name: 'Happy',
      survey: 'SAS',
      completed: 140,
      total: 165,
    },
    {
      id: "EN007",
      name: "MUGISHA Emma",
      survey: "SAS",
      completed: 140,
      total: 165,
    },
    {
      id: "EN008",
      name: "MATWI Alba",
      survey: "DHS",
      completed: 140,
      total: 165,
    },
    {
      id: 'EN009',
      name: 'Happy',
      survey: 'SAS',
      completed: 140,
      total: 165,
    }
  ];
  
  const filteredEnumerators = enumeratorData.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
  
    const matchesSurvey =
      !filters.survey || e.survey === filters.survey;
  
    return matchesSearch && matchesSurvey;
  });

  const [page, setPage] = useState(1);
  const pageSize = 5;

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
  
  return (
    <div className="enumerators-page">
      <div>
        <h1 className='enumerator-container-title'>Enumerator Management & Field Tracking</h1>
        <p className='enumerator-container-description'>Real-time monitoring and management of field enumerators</p>
      </div>

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            name: "survey",
            options: [
              { label: "All Surveys", value: "" },
              { label: "SAS", value: "SAS" },
              { label: "DHS", value: "DHS" },
            ],
          },
        ]}
        filterValues={filters}
        onFilterChange={(name, value) =>
          setFilters((prev) => ({ ...prev, [name]: value }))
        }
      />

      <Table
        columns={enumeratorColumns}
        data={paginatedData}
        emptyText="No enumerator added"
        emptyImage={NoEnumeratorImage}
        renderActions={(row) => (
          <button
            style={{border:"none", backgroundColor:"transparent", cursor:"pointer"}}
            onClick={() =>
              navigate(`/dashboard/enumerators/${row.id}`)
            }
          >
            <Eye size={18} />
          </button>
        )}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
