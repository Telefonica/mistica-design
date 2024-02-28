import React, { useState } from "react";
import transformToJSON from "../helpers/skinToJson";
import { NavigationBar, ResponsiveLayout } from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";

const Skin2Json = () => {
  const navigate = useNavigate();
  const [rawCode, setRawCode] = useState("");

  return (
    <>
      <NavigationBar onBack={() => navigate("/")} title="Skin2json" />
      <ResponsiveLayout>
        <textarea
          style={{ width: "100%", height: "300px" }}
          value={rawCode}
          onChange={(e) => setRawCode(e.target.value)}
        ></textarea>
        <textarea
          readOnly
          style={{ width: "100%", height: "300px" }}
          value={JSON.stringify(transformToJSON(rawCode), null, 2)}
        ></textarea>
      </ResponsiveLayout>
    </>
  );
};

export default Skin2Json;
