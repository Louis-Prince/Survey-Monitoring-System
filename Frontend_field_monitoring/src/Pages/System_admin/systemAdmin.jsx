import { useContext, useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import Table from "../../Components/Table/table";
import TableToolbar from "../../Components/Table/TableToolbar/tableToolbar";
import Pagination from "../../Components/Pagination/pagination";
import Button from "../../Components/Button/button";
import "./systemAdmin.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/User/UserContext";
import Loader from "../../Components/Loader/loader";
import NoSurveyImage from "../../assets/no-enumerator.png";
import { NoDataEmptyState, NoSearchResultsEmptyState } from "../../Components/EmptyState/emptyState";

export const SystemAdmin = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { getUsers } = useContext(UserContext);  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    loadUsers();
  },[getUsers]);

  const uniqueRoles = [...new Set(users.map(user => user.role))];
  
  const filterOptions = [
    {
      name: "role",
      options: [
        { value: "", label: "All Roles" },
        ...uniqueRoles.map(role => ({ value: role, label: role }))
      ]
    }
  ];

  const filterValues = {
    role: roleFilter
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === "role") {
      setRoleFilter(value);
    }
    setPage(1);
  };

  const pageSize = 10;

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedData = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const columns = [
    {
      key: "first_name",
      label: "Names",
      render: (_, row) => `${row.first_name} ${row.last_name}`,
    },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (_, row) => (
        <span className={`status-badge ${row.is_active ? "active" : "inactive"}`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleAddUser = () => {
    navigate("/dashboard/system-admin/create");
  };

  return (
    <div className="system-admin-page">
      <div className="header">
        <h1 className='system-admin-title'>System Administration</h1>
        <p className='system-admin-description'>Security, compliance, and system management</p>
      </div>

      {users.length != 0 && (
        <div className="system-admin-toolbar">
          <TableToolbar
            searchValue={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            filters={filterOptions}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
          />
          <Button 
            text="Add User" 
            onClick={handleAddUser} 
            icon={<Plus />} 
            iconPosition="left" 
            variant="primary"
          />
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          {users.length === 0 && (
            <NoDataEmptyState
              image={NoSurveyImage}
              title="No users found"
              message="There are no users in the system yet."
              suggestion="Get started by creating your first user."
              buttonText="Add User"
              onButtonClick={handleAddUser}
              buttonIcon={<Plus />}
            />
          )}

          {users.length > 0 && filteredUsers.length === 0 && (
            <NoSearchResultsEmptyState
              searchTerm={search}
              icon={<Search/>}
              title="No matching users"
              message="We couldn't find any users matching"
              suggestion="Try checking your spelling or using different keywords"
              {...(roleFilter && {
                filterName: "role",
                filterValue: roleFilter
              })}
            />
          )}

          {users.length > 0 && filteredUsers.length > 0 && (
            <>
              <Table
                columns={columns}
                data={paginatedData}
                renderActions={(row) => (
                  <div className="action-buttons">
                    <button onClick={() => navigate(`/dashboard/system-admin/edit/${row.id}`)}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDeleteUser(row.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              />
              {filteredUsers.length > 0 && (
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