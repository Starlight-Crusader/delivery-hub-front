import { useContext, useState } from "react";
import { UserDataContext } from "../App";
import { InputGroup, FormControl, Button } from "react-bootstrap";

const HeaderComponent = () => {
  const { authenticated, agentType, userRole, switchAuth } =
    useContext(UserDataContext);

  const [btnHovered, setBtnHovered] = useState(false);

  const [identData, setIdentData] = useState({
    name: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const { name, password } = identData;
      const data = {
        name,
        password,
      };

      const response = await fetch("http://127.0.0.1:8000/api/authen/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const jsonData = await response.json();

      if (response.ok) {
        switchAuth(
          jsonData.token,
          jsonData.agent_name,
          jsonData.agent_type,
          jsonData.user_role
        );
      } else {
        if (jsonData.name || jsonData.password) {
          alert("Failed to authenticate: Something is missing!");
        } else {
          alert("Failed to authenticate: " + jsonData.detail);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    switchAuth("", "", 0, 0);
  };

  const handleChange = (e) => {
    setIdentData({
      ...identData,
      [e.target.name]: e.target.value,
    });
  };

  const userRolesStr = ["", "Viewer", "Worker", "Manager"];
  const agentTypesStr = ["", "C", "P"];

  return (
    <div
      className="d-flex flex-row align-items-center justify-content-between"
      style={{
        width: "100%",
        height: "5vw",
        borderTop: "5px #434952 solid",
        borderBottom: "5px #434952 solid",
        padding: "0 7vw",
      }}
    >
      <div>
        <div className="d-flex flex-row align-items-center">
          <p style={{ fontSize: "1.5vw", marginRight: "3px" }}>Delivery</p>
          <p
            style={{
              fontSize: "1.5vw",
              color: "white",
              backgroundColor: "#434952",
              borderRadius: "5px",
              padding: "0 0.2vw",
            }}
          >
            hub
          </p>
        </div>
      </div>

      {!authenticated ? (
        <div>
          <InputGroup style={{ width: "30vw" }}>
            <FormControl
              placeholder="Agent name"
              aria-label="Agent name"
              aria-describedby="basic-addon1"
              name="name"
              value={identData.name}
              onChange={handleChange}
            />
            <FormControl
              type="password"
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon2"
              name="password"
              value={identData.password}
              onChange={handleChange}
            />
            <Button
              variant="primary"
              onClick={handleLogin}
              style={{
                backgroundColor: btnHovered ? "white" : "#434952",
                color: btnHovered ? "#434952" : "white",
                border: btnHovered ? "1px #434952 solid" : "none",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
            >
              Login
            </Button>
          </InputGroup>
        </div>
      ) : (
        <div className="d-flex flex-row align-items-center">
          <p style={{ fontSize: "1.3vw" }}>
            Welcome back, {sessionStorage.getItem("agent-name")} (
            {agentTypesStr[agentType]}) {userRolesStr[userRole]}
          </p>

          <Button
            variant="primary"
            onClick={handleLogout}
            style={{
              backgroundColor: btnHovered ? "white" : "#434952",
              color: btnHovered ? "#434952" : "white",
              border: btnHovered ? "1px #434952 solid" : "none",
              transition: "background-color 0.3s, color 0.3s",
              marginLeft: "20px",
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderComponent;
