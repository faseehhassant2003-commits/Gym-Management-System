import { useEffect, useState } from "react";
const loggedInUsername = localStorage.getItem("username");
import Layout from "../layouts/Layout";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "../api/UserApi";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRoleChange(id, role) {
    try {
      await updateUserRole(id, role);
      loadUsers();
    } catch (error) {
      alert("Failed to update role");
    }
  }

  async function handleStatus(id, enabled) {
    try {
      await updateUserStatus(id, enabled);
      loadUsers();
    } catch (error) {
      alert("Failed to update status");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  }

  return (
    <Layout>
      <div className="container-fluid">

        <div className="card shadow-sm">

          <div className="card-header bg-dark text-white">
            <h3 className="mb-0">Manage Users</h3>
          </div>

          <div className="card-body">

            <table className="table table-bordered table-hover">

              <thead className="table-dark">

                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th width="350">Actions</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td>{user.username}</td>

                    <td>
                      <span className="badge bg-primary">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.enabled ? (
                        <span className="badge bg-success">
                          Enabled
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          Disabled
                        </span>
                      )}
                    </td>

                    <td>

                      <div className="d-flex gap-2">

                        <select
                          className="form-select"
                          value={user.role}
                          disabled={user.username === loggedInUsername}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="TRAINER">TRAINER</option>
                          <option value="MEMBER">MEMBER</option>
                        </select>

                        <button
                        disabled={user.username === loggedInUsername}
                          className={
                            user.enabled
                              ? "btn btn-warning"
                              : "btn btn-success"
                          }
                          onClick={() =>
                            handleStatus(
                              user.id,
                              !user.enabled
                            )
                          }
                        >
                          {user.enabled ? "Disable" : "Enable"}
                        </button>

                        <button
                        disabled={user.username === loggedInUsername}
                          className="btn btn-danger"
                          onClick={() =>
                            handleDelete(user.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default ManageUsers;