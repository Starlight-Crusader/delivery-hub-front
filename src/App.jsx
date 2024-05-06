import React, { createContext, useState } from "react";
import HeaderComponent from "./components/HeaderComponent";
import MainComponent from "./components/MainComponent";

export const UserDataContext = createContext();
function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [agentType, setAgentType] = useState(0);
  const [userRole, setUserRole] = useState(0);

  const switchAuth = (token, aName, aType, uRole) => {
    if (token.length === 0) {
      setAuthenticated(false);
      setAgentType(0);
      setUserRole(0);

      sessionStorage.removeItem("auth-token");
      sessionStorage.removeItem("agent-name");
    } else {
      setAuthenticated(true);
      setAgentType(aType);
      setUserRole(uRole);

      sessionStorage.setItem("auth-token", token);
      sessionStorage.setItem("agent-name", aName);
    }
  };

  return (
    <UserDataContext.Provider
      value={{ authenticated, agentType, userRole, switchAuth }}
    >
      <div
        className="container d-flex flex-column align-items-center"
        style={{
          maxWidth: "75vw",
          height: "100vh",
          backgroundColor: "white",
          padding: 0,
        }}
      >
        <HeaderComponent />

        <div
          style={{ width: "100%", flexGrow: 1, padding: "4vw 0" }}
          className="d-flex flex-column align-items-center justify-content-between"
        >
          <MainComponent />
        </div>
      </div>
    </UserDataContext.Provider>
  );
}

export default App;
