import "./table.css";

export default function Table({
  columns = [],
  data = [],
  emptyText,
  emptyImage,
  renderActions,
}) {
  if (!data.length) {
    return (
        <div className="table-empty-container">
            <div className="table-empty">
              {emptyImage && <img src={emptyImage} alt="empty" />}
              <p>{emptyText || "No data available"}</p>
            </div>          
        </div>
      
    );
  }

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}

              {renderActions && (
                <td className="actions-cell">
                  {renderActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
