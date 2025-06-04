import React, { useState } from "react";

const UserList = ({ users, onUserUpdated, loading }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);

  const startEditing = (user) => {
    setEditingUser({ ...user });
    setError(null);
  };

  const handleEditingUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8080/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditingUser(null);
      onUserUpdated();
    } catch (err) {
      setError(`사용자 업데이트에 실패했습니다: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (
      !window.confirm(`${userToDelete.name} 사용자를 정말 삭제하시겠습니까?`)
    ) {
      return;
    }

    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8080/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToDelete),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onUserUpdated();
    } catch (err) {
      setError(`사용자 삭제에 실패했습니다: ${err.message}`);
    }
  };

  return (
    <section className="list-section">
      <h2>사용자 목록</h2>
      {error && <p className="status-message error">{error}</p>}
      {users.length === 0 ? (
        <p>등록된 사용자가 없습니다.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {editingUser && editingUser.id === user.id ? (
                <form onSubmit={handleUpdateUser} className="edit-form">
                  <input
                    type="text"
                    name="name"
                    value={editingUser.name}
                    onChange={handleEditingUserChange}
                    required
                    disabled={loading}
                  />
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleEditingUserChange}
                    required
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading}>
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    disabled={loading}
                  >
                    취소
                  </button>
                </form>
              ) : (
                <>
                  <span>
                    ID: {user.id} | 이름: {user.name} | 이메일: {user.email}
                  </span>
                  <div className="actions">
                    <button
                      onClick={() => startEditing(user)}
                      disabled={loading}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      disabled={loading}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UserList;
