import React, { useState } from "react";
import "./userboard.css";
import { User, RegisterUserRequest } from "../../auth/types";
import { BASE_URL } from "../../shared/constants";

const UsersPage: React.FC = () => {
  const { role } = useAuthContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (role !== "Teacher") {
    return;
  }

  const handleAddUser = async (newUser: RegisterUserRequest) => {
    try {
      const res = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.status === 201) {
        setMessage("✅ Användaren registrerades.");
        setIsAddModalOpen(false);
        return;
      }

      const error = await res.json();
      setMessage(
        `❌ Registrering misslyckades: ${error?.message || "Okänt fel"}`
      );
    } catch {
      setMessage("❌ Ett fel inträffade vid registrering.");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Användare</h1>

      {message && <div className="message">{message}</div>}

      <div className="toolbar">
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          Lägg till användare
        </button>
      </div>

      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Lägg till användare</h2>
            <UserForm
              onSave={async (newUser: RegisterUserRequest | User) => {
                await handleAddUser(newUser as RegisterUserRequest);
              }}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const UserForm: React.FC<{
  user?: User;
  onSave: (u: RegisterUserRequest | User) => void;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState<RegisterUserRequest>({
    Email: "",
    UserName: "",
    Password: "",
    Role: "Student",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(user ? { ...user, ...form } : form);
      }}
      className="form"
    >
      <input
        className="input"
        placeholder="Email"
        value={form.Email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, Email: e.target.value })
        }
      />
      <input
        className="input"
        placeholder="Användarnamn"
        value={form.UserName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, UserName: e.target.value })
        }
      />
      <input
        className="input"
        type="password"
        placeholder="Lösenord"
        value={form.Password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setForm({ ...form, Password: e.target.value })
        }
      />
      <select
        className="input"
        value={form.Role}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setForm({ ...form, Role: e.target.value })
        }
      >
        <option value="Student">Elev</option>
        <option value="Teacher">Lärare</option>
      </select>
      <div className="modal-actions">
        <button type="submit" className="btn-primary">
          Spara
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Avbryt
        </button>
      </div>
    </form>
  );
};

type UserRole = "Teacher" | "Student";

function useAuthContext(): { role: UserRole } {
  throw new Error("Function not implemented.");
}

export default UsersPage;
