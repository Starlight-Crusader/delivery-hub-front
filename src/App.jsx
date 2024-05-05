import React, { createContext, useState } from "react";
import HeaderComponent from "./components/HeaderComponent";

export const AuthContext = createContext(false);

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const switchAuth = (token, aName, aType, uRole) => {
    if (token.length === 0) {
      setAuthenticated(false);

      sessionStorage.removeItem("auth-token");
      sessionStorage.removeItem("agent-name");
      sessionStorage.removeItem("agent-type");
      sessionStorage.removeItem("user-role");
    } else {
      setAuthenticated(true);

      sessionStorage.setItem("auth-token", token);
      sessionStorage.setItem("agent-name", aName);
      sessionStorage.setItem("agent-type", aType);
      sessionStorage.setItem("user-role", uRole);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, switchAuth }}>
      <div
        className="container"
        style={{
          maxWidth: "75vw",
          height: "100vh",
          backgroundColor: "white",
          padding: 0,
        }}
      >
        <HeaderComponent></HeaderComponent>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
