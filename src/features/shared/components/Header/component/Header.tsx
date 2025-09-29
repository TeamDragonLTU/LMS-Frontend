
import { ReactElement } from "react";
import { useAuthContext } from "../../../../auth/hooks";
import { useNavigate } from "react-router";
import { BookOpen, UserCircle, LogOut } from "lucide-react";
import  "../css/Header.css";

export function Header(): ReactElement {
  const { isLoggedIn, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleOnLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="g-container" id="header">
      <div className="left-header-container">
        <BookOpen className="book-icon" />
        <h1>Lexicon LMS</h1>
      </div>

      <div className="right-header-container">
        <div className="display-role-container">
          <div className="account-circle-icon-background">
            <UserCircle size={24} />
          </div>
          <p>Elev</p>
        </div>

        {isLoggedIn && (
          <div className="logout-container" onClick={handleOnLogout}>
            <LogOut size={20} />
            <p>Logga ut</p>
          </div>
        )}
      </div>
    </header>
  );
}
