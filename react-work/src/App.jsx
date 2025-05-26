import React, { useState, useEffect } from "react";
import "./App.css"; // 기본적인 스타일링을 위한 CSS 파일

const API_BASE_URL = "http://127.0.0.1:8000"; // Sanic 백엔드 주소

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null); // 수정 중인 사용자 정보
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 사용자 목록 불러오기
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/read`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("사용자 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 목록 불러오기
  useEffect(() => {
    fetchUsers();
  }, []);

  // 입력 필드 변경 핸들러
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditingUserChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  // 사용자 생성
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.status === 409) {
        setError("이메일이 이미 존재합니다. 다른 이메일을 사용해주세요.");
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewUser({ name: "", email: "" }); // 입력 필드 초기화
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      console.error("Failed to create user:", err);
      setError(`사용자 생성에 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 수정 모드 진입
  const startEditing = (user) => {
    setEditingUser({ ...user });
  };

  // 사용자 업데이트
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditingUser(null); // 수정 모드 종료
      fetchUsers(); // 목록 새로고침
    } catch (err) {
      console.error("Failed to update user:", err);
      setError(`사용자 업데이트에 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async (userToDelete) => {
    if (
      !window.confirm(`${userToDelete.name} 사용자를 정말 삭제하시겠습니까?`)
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 백엔드 delete 엔드포인트의 validate(json=User) 요구사항을 충족하기 위해 name과 email을 보냅니다.
      // 실제로는 id만 필요하지만, Sanic 백엔드의 검증 규칙 때문에 필요합니다.
      const response = await fetch(`${API_BASE_URL}/delete`, {
        method: "POST", // Sanic 백엔드에서 POST로 정의되어 있음
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userToDelete.id,
          name: userToDelete.name,
          email: userToDelete.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchUsers(); // 목록 새로고침
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(`사용자 삭제에 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>사용자 관리 시스템</h1>

      {loading && (
        <p className="status-message loading">데이터를 처리 중입니다...</p>
      )}
      {error && <p className="status-message error">에러: {error}</p>}

      {/* 사용자 생성 폼 */}
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
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={newUser.email}
            onChange={handleNewUserChange}
            required
          />
          <button type="submit" disabled={loading}>
            사용자 추가
          </button>
        </form>
      </section>

      <hr />

      {/* 사용자 목록 */}
      <section className="list-section">
        <h2>사용자 목록</h2>
        {users.length === 0 && !loading && <p>등록된 사용자가 없습니다.</p>}
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {editingUser && editingUser.id === user.id ? (
                // 수정 모드
                <form onSubmit={handleUpdateUser} className="edit-form">
                  <input
                    type="text"
                    name="name"
                    value={editingUser.name}
                    onChange={handleEditingUserChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleEditingUserChange}
                    required
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
                // 일반 보기 모드
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
      </section>
    </div>
  );
}

export default App;
