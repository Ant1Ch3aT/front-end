import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ users, setUsers }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (err) {
        setError("사용자 정보를 불러오는데 실패했습니다.");
        console.error("Importing UserData ERROR", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [setUsers]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
        사용자 목록을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="list-container">
      <h2>등록된 사용자</h2>
      {users.length === 0 ? (
        <p className="empty-list-message">아직 등록된 사용자가 없습니다.</p>
      ) : (
        <ul className="user-list">
          {users.map((user, index) => (
            <li key={user.id}>
              <span className="user-name">
                {index + 1}. {user.name}
              </span>
              <span className="user-email">{user.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
