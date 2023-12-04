import React, { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import MetamaskModal from "./components/modal/MetamaskModal";
import { BrowserRouter } from "react-router-dom";
import MainComponent from "./pages";

const App = () => {
  const [userConnected, setuserConnected] = useState(false);
  const { status, connect, account } = useMetaMask();
  const [modal, setmodal] = useState(true);

  useEffect(() => {
    if (
      status === "connected" &&
      account === "0x840589897dcdb1cc8773c616bf22a90e53e961f3"
    ) {
      setuserConnected(true);
      setmodal(false);
    } else {
      setuserConnected(false);
      setmodal(true);
    }
    if (status === "notConnected") {
      setuserConnected(false);
      setmodal(true);
    }
  }, [status, account]);

  return (
    <BrowserRouter>
      {userConnected && <MainComponent />}
      {modal && (
        <MetamaskModal
          connect={connect}
          message={"Connect to Metamask with your Admin Account Before Using"}
        />
      )}
    </BrowserRouter>
  );
};

export default App;
