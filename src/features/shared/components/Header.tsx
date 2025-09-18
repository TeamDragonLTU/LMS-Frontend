import { ReactElement } from "react";
import { useAuthContext } from "../../auth/hooks";
import { useNavigate } from "react-router";

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
        <span className="material-symbols-outlined book-icon">menu_book</span>
        <h1>Lexicon LMS</h1>
      </div>

      <div className="right-header-container">
        <div className="display-role-container">
          <div className="account-circle-icon-background">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
          <p>Elev</p>
        </div>

        {isLoggedIn && (
          <div className="logout-container">
            <span
              className="material-symbols-outlined"
              onClick={handleOnLogout}
            >
              Logout
            </span>
            <span onClick={handleOnLogout}>Logga ut</span>
          </div>
        )}
      </div>
    </header>
  );
}
