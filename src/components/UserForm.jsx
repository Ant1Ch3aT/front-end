import React, { useState } from "react";

const UserForm = ({ onUserAdded, loading }) => {
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [error, setError] = useState(null);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8080/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.status === 409) {
        setError("이메일이 이미 존재합니다. 다른 이메일을 사용해주세요.");
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewUser({ name: "", email: "" });
      onUserAdded();
    } catch (err) {
      setError(`사용자 생성에 실패했습니다: ${err.message}`);
    }
  };

  return (
    <section className="create-section">
      <h2>새 사용자 생성</h2>
      <form onSubmit={handleCreateUser}>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={newUser.name}
          onChange={handleNewUserChange}
          required
          disabled={loading}
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={newUser.email}
          onChange={handleNewUserChange}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          사용자 추가
        </button>
      </form>
      {error && <p className="status-message error">{error}</p>}
    </section>
  );
};

export default UserForm;
