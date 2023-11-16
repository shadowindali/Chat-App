import React from "react";
import { useSelector } from "react-redux";

function Welcome() {
  let LightMode = useSelector((state) => state.themeKey);

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    console.log("User not Authenticated");
    window.location.href = "/";
  }

  return (
    <div className={"welcome-container" + (LightMode ? " whitecont" : " dark")}>
      <div
        className={"welcome-small-contaier" + (LightMode ? " white" : " dark")}
      >
        <h1>W E L C O M E</h1>
        <p className="welcome-par">It's Us Or No One</p>
      </div>
    </div>
  );
}

export default Welcome;
