function DashboardCard({ title, value, icon, color }) {
  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{ borderRadius: "15px" }}
    >
      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <h6 className="text-muted">{title}</h6>
          <h2 className="fw-bold mb-0">{value}</h2>
        </div>

        <div
          className={`${color} rounded-circle d-flex justify-content-center align-items-center`}
          style={{
            width: "70px",
            height: "70px",
          }}
        >
          <i className={`bi ${icon} text-white fs-2`}></i>
        </div>

      </div>
    </div>
  );
}

export default DashboardCard;