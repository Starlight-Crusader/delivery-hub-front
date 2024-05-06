import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../App";
import { Button, Pagination, InputGroup, FormControl } from "react-bootstrap";

const tIconSrcLink = "https://cdn-icons-png.flaticon.com/512/58/58679.png";
const fIconSrcLink = "https://cdn-icons-png.freepik.com/512/4848/4848621.png";

const checkURL = "http://127.0.0.1:8000/api/deliveries/check/";
const takeURL = "http://127.0.0.1:8000/api/deliveries/take/";
const openURL = "http://127.0.0.1:8000/api/deliveries/create";
const removeURL = "http://127.0.01:8000/api/deliveries/remove-one/";

const defGetURL = "http://127.0.0.1:8000/api/deliveries/get";

const MainComponent = () => {
  const { authenticated, agentType, userRole, switchAuth } =
    useContext(UserDataContext);

  const [data, setData] = useState([]);

  const [prevPageURL, setPrevPageURL] = useState(null);
  const [currPageURL, setCurrPageURL] = useState(defGetURL);
  const [nextPageURL, setNextPageURL] = useState(null);
  const [currPageNum, setCurrPageNum] = useState(1);

  const [recipientAgentName, setRecipientAgentName] = useState("");

  const updURLs = (prevURL, currURL, nextURL) => {
    setPrevPageURL(prevURL);
    setCurrPageURL(currURL);
    setNextPageURL(nextURL);
  };

  const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
        },
      });

      const jsonData = await response.json();

      if (response.status == 200) {
        setData(jsonData.results);
        updURLs(jsonData.previous, url, jsonData.next);
      } else if (response.status == 401) {
        setData([]);
        updURLs("", defGetURL, "");
        setCurrPageNum(1);
        switchAuth("", "", 0, 0);

        alert("Auth. credentials are expired/incorrect/missing!");
      } else {
        alert("Failed to get data: " + jsonData.detail);
      }
    } catch (error) {
      console.error("Error performign action: ", error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchData(currPageURL);
    }
  }, [authenticated, currPageNum]);

  const btnHandleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "#434952";
    e.currentTarget.style.color = "white";
    e.currentTarget.style.border = "none";
  };

  const btnHandleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "#434952";
    e.currentTarget.style.border = "1px #434952 solid";
  };

  const UDMI = async (url, reqMethod, reqBody) => {
    try {
      const response = await fetch(url, {
        method: reqMethod,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: reqBody,
      });

      const jsonData = await response.json();

      if (response.status == 200 || response.status == 201) {
        fetchData(currPageURL);
      } else if (response.status == 401) {
        alert("Auth. credentials are expired/incorrect/missing!");
        setData([]);
        switchAuth("", "", 0, 0);
      } else {
        alert("Request failed: " + jsonData.detail);
      }
    } catch (error) {
      console.error("Failed to perform the request: ", error);
    }
  };

  const handleCheck = (id) => {
    UDMI(checkURL + id, "PATCH", "");
  };

  const handleTake = (id) => {
    UDMI(takeURL + id, "PATCH", "");
  };

  const handleOpen = () => {
    UDMI(openURL, "POST", JSON.stringify({ to_name: recipientAgentName }));
  };

  const handleRemove = (id) => {
    UDMI(removeURL + id, "DELETE", "");
  };

  const handleChange = (e) => {
    setRecipientAgentName(e.target.value);
  };

  return authenticated ? (
    <>
      <div className="d-flex flex-column align-items-center">
        {data.length > 0 ? (
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
                {userRole == 2 || (userRole == 3 && agentType == 2) ? (
                  <th></th>
                ) : null}
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
                      <img
                        src={tIconSrcLink}
                        alt="Issued"
                        style={{ width: "10%" }}
                      />
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
                        onMouseOver={btnHandleMouseOver}
                        onMouseLeave={btnHandleMouseLeave}
                        onClick={() => handleCheck(item.id)}
                      >
                        Check
                      </Button>
                    </td>
                  ) : null}

                  {userRole == 3 &&
                  agentType == 1 &&
                  item.by_agent == localStorage.getItem("agent-name") ? (
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
                        onMouseOver={btnHandleMouseOver}
                        onMouseLeave={btnHandleMouseLeave}
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  ) : (
                    <td></td>
                  )}

                  {userRole == 3 && agentType == 2 && item.by_agent === null ? (
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
                        onMouseOver={btnHandleMouseOver}
                        onMouseLeave={btnHandleMouseLeave}
                        onClick={() => handleTake(item.id)}
                      >
                        Take
                      </Button>
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: "1.5vw", marginBottom: "5vw" }}>
            No records available!
          </p>
        )}

        {userRole == 3 && agentType == 1 && (
          <InputGroup style={{ width: "30vw", marginTop: "30px" }}>
            <FormControl
              placeholder="Agent name"
              aria-label="Agent name"
              aria-describedby="basic-addon1"
              name="name"
              value={recipientAgentName}
              onChange={handleChange}
            />
            <Button
              variant="primary"
              style={{
                backgroundColor: "#434952",
                color: "white",
                border: "none",
                transition: "background-color 0.3s, color 0.3s",
                fontSize: "15px",
              }}
              onMouseOver={btnHandleMouseOver}
              onMouseLeave={btnHandleMouseLeave}
              onClick={() => handleOpen()}
            >
              Open a new delivery order
            </Button>
          </InputGroup>
        )}
      </div>

      <Pagination>
        <Pagination.Prev
          onClick={() => {
            setCurrPageURL(prevPageURL);
            setCurrPageNum(currPageNum - 1);
          }}
          disabled={prevPageURL === null}
        />
        <Pagination.Item disabled>{currPageNum}</Pagination.Item>
        <Pagination.Next
          onClick={() => {
            setCurrPageURL(nextPageURL);
            setCurrPageNum(currPageNum + 1);
          }}
          disabled={nextPageURL === null}
        />
      </Pagination>
    </>
  ) : (
    <p style={{ fontSize: "1.5vw", marginBottom: "5vw" }}>
      Authenticate in order to see delivery records...
    </p>
  );
};

export default MainComponent;
