import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../App";
import { Button } from "react-bootstrap";

const tIconSrcLink = "https://cdn-icons-png.flaticon.com/512/58/58679.png";
const fIconSrcLink = "https://cdn-icons-png.freepik.com/512/4848/4848621.png";

const MainComponent = () => {
  const { authenticated, agentType, userRole, switchAuth } =
    useContext(UserDataContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("Fetched data:", data);
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/deliveries/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
        },
      });

      const jsonData = await response.json();

      if (response.status == 200) {
        setData(jsonData.results);
      } else if (response.status == 401) {
        alert("Auth. credentials are expired/incorrect/missing!");
        setData([]);
        switchAuth("", "", 0, 0);
      } else {
        alert("Failed to get data: " + jsonData.detail);
      }
    } catch (error) {
      console.error("Error performign action: ", error);
    }
  };

  useEffect(() => {
    if (authenticated && sessionStorage.getItem("auth-token")) {
      fetchData();
    } else if (!authenticated && data.length > 0) {
      setData([]);
    }
  }, [authenticated]);

  const checkBtnHandleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#434952";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.border = "none";
  };

  const checkBtnHandleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "#434952";
    e.currentTarget.style.border = "1px #434952 solid";
  };

  const updateCheckDelivery = async (id) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/deliveries/check/" + id,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        }
      );

      const jsonData = await response.json();

      if (response.status == 200) {
        fetchData();
      } else if (response.status == 401) {
        alert("Auth. credentials are expired/incorrect/missing!");
        setData([]);
        switchAuth("", "", 0, 0);
      } else {
        alert("Failed to update data: " + jsonData.detail);
      }
    } catch (error) {
      console.error("Error performign action: ", error);
    }
  };

  const handleCheck = (id) => {
    updateCheckDelivery(id);
  };

  return authenticated ? (
    <table style={{ width: "75%" }} className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>From Agent</th>
          <th>To Agent</th>
          <th>By Agent</th>
          <th>Issued</th>
          <th>Delivered</th>
          <th>Received</th>
          {userRole == 2 ? <th></th> : null}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td style={{ width: "4%" }} data-sort={true}>
              {item.id}
            </td>
            <td style={{ width: "16%" }}>{item.from_agent.name}</td>
            <td style={{ width: "16%" }}>{item.to_agent.name}</td>
            <td style={{ width: "16%" }}>
              {item.by_agent ? item.by_agent.name : "-"}
            </td>
            <td style={{ width: "16%" }}>
              {item.issued ? (
                <img src={tIconSrcLink} alt="Issued" style={{ width: "10%" }} />
              ) : (
                <img
                  src={fIconSrcLink}
                  alt="Not issued"
                  style={{ width: "10%" }}
                />
              )}
            </td>
            <td style={{ width: "16%" }}>
              {item.delivered ? (
                <img
                  src={tIconSrcLink}
                  alt="Delivered"
                  style={{ width: "10%" }}
                />
              ) : (
                <img
                  src={fIconSrcLink}
                  alt="Not delivered"
                  style={{ width: "10%" }}
                />
              )}
            </td>
            <td style={{ width: "16%" }}>
              {item.received ? (
                <img
                  src={tIconSrcLink}
                  alt="Received"
                  style={{ width: "10%" }}
                />
              ) : (
                <img
                  src={fIconSrcLink}
                  alt="Not recieved"
                  style={{ width: "10%" }}
                />
              )}
            </td>
            {userRole == 2 ? (
              <td>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: "#434952",
                    color: "white",
                    border: "none",
                    transition: "background-color 0.3s, color 0.3s",
                    fontSize: "15px",
                    marginLeft: "50px",
                  }}
                  onMouseOver={checkBtnHandleMouseOver}
                  onMouseLeave={checkBtnHandleMouseLeave}
                  onClick={() => handleCheck(item.id)}
                >
                  Check
                </Button>
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={{ fontSize: "1.5vw", marginBottom: "5vw" }}>
      Authenticate in order to see delivery records...
    </p>
  );
};

export default MainComponent;
