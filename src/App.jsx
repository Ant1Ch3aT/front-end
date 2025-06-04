import React, { useEffect, useState } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await fetch("http://127.0.0.1:8080/read");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setFetchError("사용자 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>사용자 관리 시스템</h1>

      {loading && (
        <p className="status-message loading">데이터를 처리 중입니다...</p>
      )}
      {fetchError && <p className="status-message error">{fetchError}</p>}

      <UserForm onUserAdded={fetchUsers} loading={loading} />
      <UserList users={users} onUserUpdated={fetchUsers} loading={loading} />
    </div>
  );
}

export default App;
