// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/AdminDashboardOverview.css';
// import { useNavigate } from 'react-router-dom';

// const AdminDashboardOverview = () => {
//   const [stats, setStats] = useState(null);
//   const [lastLogin, setLastLogin] = useState(null); // 🕓 Last login
//   const [userRole, setUserRole] = useState('admin'); // Could be dynamic

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await axios.get('/api/dashboard-overview', { withCredentials: true });
//         setStats(res.data);

//         // 🕓 Mock last login - replace with real API if available
//         const mockLastLogin = new Date();
//         mockLastLogin.setHours(mockLastLogin.getHours() - 4);
//         setLastLogin(mockLastLogin.toString());

//       } catch (error) {
//         console.error("Error fetching summary:", error);
//       }
//     };
//     fetchSummary();
//   }, []);

//   // ⚡ Define quick actions
//   const navigate = useNavigate();
//   const quickActions = {
//     admin: [
      
//       { label: "📋 View All Requests",onClick: () => navigate("/admin/requests"),},
//       { label: "✅ Approve Bulk", onClick: () => console.log("Opening bulk approval...") },
//       { label: "📥 Download Report", onClick: () => console.log("Downloading...") },
//       { label: "👥 Manage Users", onClick: () => console.log("Navigating to user management...") },
//     ]
//   };

//   return (
//     <div className="admin-overview-container">
//       <h2 className="admin-welcome">👋 Welcome, Admin!</h2>

//       {/* Last Login */}
//       {lastLogin && (
//         <p className="last-login">🕓 Last login: {new Date(lastLogin).toLocaleString()}</p>
//       )}

//       {/* Stats Cards */}
//       <div className='dashboard-layout'>
//       {stats ? (
//         <div className="overview-grid">
//           <div className="overview-card">
//             <h3>📨 Internship Requests</h3>
//             <p>{stats.internshipCount}</p>
//           </div>
//           <div className="overview-card">
//             <h3>📑 ID Card Requests</h3>
//             <p>{stats.idCount}</p>
//           </div>
//           <div className="overview-card">
//             <h3>🏖 Leave Requests</h3>
//             <p>{stats.leaveCount}</p>
//           </div>
//           <div className="overview-card">
//             <h3>🚀 Hackathon Requests</h3>
//             <p>{stats.hackathonCount}</p>
//           </div>
//           <div className="overview-card approved">
//             <h3>✅ Approved</h3>
//             <p>{stats.approvedCount}</p>
//           </div>
//           <div className="overview-card pending">
//             <h3>⏳ Pending</h3>
//             <p>{stats.pendingCount}</p>
//           </div>
//           <div className="overview-card rejected">
//             <h3>❌ Rejected</h3>
//             <p>{stats.rejectedCount}</p>
//           </div>
//         </div>
//       ) : (
//         <p className="loading-text">Loading dashboard...</p>
//       )}

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h3>⚡ Quick Actions</h3>
//         <div className="quick-buttons">
//           {quickActions[userRole]?.map((action, index) => (
//             <button key={index} onClick={action.onClick} className="quick-action-btn">
//               {action.label}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default AdminDashboardOverview;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboardOverview.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);
  const [userRole, setUserRole] = useState('admin');

  const [bulkDays, setBulkDays] = useState(3);
  const [bulkType, setBulkType] = useState("hackathon");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/dashboard-overview', { withCredentials: true });
        setStats(res.data);

        const mockLastLogin = new Date();
        mockLastLogin.setHours(mockLastLogin.getHours() - 4);
        setLastLogin(mockLastLogin.toString());
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
    fetchSummary();
  }, []);

  const quickActions = {
    admin: [
      { label: "📋 View All Requests", onClick: () => navigate("/admin/requests") },
      // { label: "📥 Download Report", onClick: () => console.log("Downloading...") },
      { label: "👥 Student History", onClick: () => navigate("/admin/users") }
    ]
  };

   const handleBulkApprove = async () => {
  try {
    const res = await axios.post('/api/admin/bulk-approve-ids', {
      type: bulkType,
      daysAhead: parseInt(bulkDays),
    });

    const pendingIds = res.data.ids; // array of _ids

    if (!pendingIds || pendingIds.length === 0) {
      return Swal.fire({
        icon: 'info',
        title: 'No Requests',
        text: 'No pending requests found for selected criteria.',
      });
    }

    for (let i = 0; i < pendingIds.length; i++) {
      await handleApprove(pendingIds[i]); // same as your existing single approve
    }

    Swal.fire({
      icon: 'success',
      title: 'Bulk Approved!',
      text: `${pendingIds.length} ${bulkType} requests successfully approved.`,
    });
  } catch (err) {
    console.error("Bulk approval failed:", err);
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: err.response?.data?.error || 'Something went wrong!',
    });
  }
};


  return (
    <div className="admin-overview-container">
      <h2 className="admin-welcome">👋 Welcome, Admin!</h2>

      {lastLogin && (
        <p className="last-login">🕓 Last login: {new Date(lastLogin).toLocaleString()}</p>
      )}

      <div className='dashboard-layout'>
        {stats ? (
          <div className="overview-grid">
            <div className="overview-card">
              <h3>📨 Internship Requests</h3>
              <p>{stats.internshipCount}</p>
            </div>
            <div className="overview-card">
              <h3>📑 ID Card Requests</h3>
              <p>{stats.idCount}</p>
            </div>
            <div className="overview-card">
              <h3>🏖 Leave Requests</h3>
              <p>{stats.leaveCount}</p>
            </div>
            <div className="overview-card">
              <h3>🚀 Hackathon Requests</h3>
              <p>{stats.hackathonCount}</p>
            </div>
            <div className="overview-card approved">
              <h3>✅ Approved</h3>
              <p>{stats.approvedCount}</p>
            </div>
            <div className="overview-card pending">
              <h3>⏳ Pending</h3>
              <p>{stats.pendingCount}</p>
            </div>
            <div className="overview-card rejected">
              <h3>❌ Rejected</h3>
              <p>{stats.rejectedCount}</p>
            </div>
          </div>
        ) : (
          <p className="loading-text">Loading dashboard...</p>
        )}

        <div className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-buttons">
            {quickActions[userRole]?.map((action, index) => (
              <button key={index} onClick={action.onClick} className="quick-action-btn">
                {action.label}
              </button>
            ))}
          </div>

          {/* 🔽 Bulk Approval UI */}
          {/* <div className="bulk-approve">
            <label>🗓️ Bulk Approve Pending Requests Within</label>
            <select value={bulkDays} onChange={(e) => setBulkDays(Number(e.target.value))}>
              <option value={3}>Next 3 Days</option>
              <option value={7}>Next 7 Days</option>
              <option value={14}>Next 14 Days</option>
            </select>

            <select value={bulkType} onChange={(e) => setBulkType(e.target.value)}>
              <option value="hackathon">Hackathon</option>
              <option value="internship">Internship</option>
              <option value="idcard">ID Card</option>
              <option value="leave">Leave</option>
            </select>

            <button className="quick-action-btn" onClick={handleBulkApprove}>
              ✅ Approve Bulk
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
