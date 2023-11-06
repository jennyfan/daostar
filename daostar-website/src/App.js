import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Register from "./components/Register/Register";
import TopNavigation from "./components/TopNavigation/TopNavigation";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import ExplorePage from "./components/ExplorePage/ExplorePage";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useQuery } from "@apollo/client";
import registrationIdsToFilter from "./components/FilterRegistrations/Filter_Registrations_By_Id";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";

import queries from "./components/ExplorePage/queries/registrations";
import "./App.css";
import "./bp4-theme.css";
import Eye from "./components/Homepage/Eye/Eye";

const mainnetOldClient = new ApolloClient({
  link: createHttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/rashmi-278/daostar-ethereum-mainnet-v0",
  }),
  cache: new InMemoryCache(),
});

const alchemyId = process.env.ALCHEMY_ID;
const walletConnectId = process.env.WALLETCONNECT_ID;

const client = createConfig(
  getDefaultConfig({
    appName: "DAOstar",
    alchemyId,
    walletConnectId,
  })
);

function App() {
  const {
    loading,
    error,
    data: mainnetData,
  } = useQuery(queries.REGISTRATIONS, {
    context: { apiName: "mainnet" },
    variables: { id: "mainnet" },
  });

  const {
    loading: mainnetv0Loading,
    error: mainnetv0Error,
    data: mainnetv0Data,
  } = useQuery(queries.REGISTRATIONSOLD, {
    client: mainnetOldClient,
    context: { apiName: "mainnet" },
    variables: { id: "mainnet" },
  });

  const goerliRes = useQuery(queries.REGISTRATIONS, {
    context: { apiName: "goerli" },
    variables: { id: "goerli" },
  });
  const optimismGoerliRes = useQuery(queries.REGISTRATIONS, {
    context: { apiName: "optimismGoerli" },
    variables: { id: "optimism-goerli" },
  });
  const arbitrumGoerliRes = useQuery(queries.REGISTRATIONS, {
    context: { apiName: "arbitrumGoerli" },
    variables: { id: "arbitrum-goerli" },
  });
  const chapelRes = useQuery(queries.REGISTRATIONS, {
    context: { apiName: "chapel" },
    variables: { id: "chapel" },
  });

  const optimismRes = useQuery(queries.REGISTRATIONS, {
    context: { apiName: "optimism" },
    variables: { id: "optimism" },
  });

  const {
    loading: goerliLoading,
    error: goerliError,
    data: goerliData,
  } = goerliRes;

  const gnosisRes = useQuery(queries.REGISTRATIONS, {
    context: { apiName: "gnosis" },
    variables: { id: "gnosis" },
  });
  const {
    loading: optimismLoading,
    error: optimismError,
    data: optimismData,
  } = optimismRes;

  const {
    loading: optimismGoerliLoading,
    error: optimismGoerliError,
    data: optimismGoerliData,
  } = optimismGoerliRes;
  const {
    loading: arbitrumGoerliLoading,
    error: arbitrumGoerliError,
    data: arbitrumGoerliData,
  } = arbitrumGoerliRes;
  const {
    loading: chapelLoading,
    error: chapelError,
    data: chapelData,
  } = chapelRes;

  const {
    loading: gnosisLoading,
    error: gnosisError,
    data: gnosisData,
  } = gnosisRes;

  console.log({
    mainnetData,
    mainnetv0Data,
    goerliData,
    gnosisData,
    optimismGoerliData,
    arbitrumGoerliData,
    chapelData,
  });

  if (
    error ||
    goerliError ||
    optimismGoerliError ||
    arbitrumGoerliError ||
    chapelError ||
    optimismError ||
    mainnetv0Error
  ) {
    console.error("Mainnet Error " + error);
    console.error("Mainnet v0 Error " + mainnetv0Error);
    console.error("Goerli Error " + goerliError);
    console.error("Optimism Goerli Error " + optimismGoerliError);
    console.error("Arbitrum Goerli Error" + arbitrumGoerliError);
    console.error("Chapel Error" + chapelError);
    console.error("Optimism Error" + optimismError);
  }
  if (
    loading ||
    goerliLoading ||
    gnosisLoading ||
    optimismGoerliLoading ||
    arbitrumGoerliLoading ||
    chapelLoading ||
    optimismLoading ||
    mainnetv0Loading
  )
    return "loading...";
  const mainnetRegistrations =
    mainnetData?.registrationNetwork?.registrations || [];
  const mainnetv0Registrations =
    mainnetv0Data?.registrationNetwork?.registrations || [];
  const goerliRegistrations =
    goerliData?.registrationNetwork?.registrations || [];
  const optimismGoerliRegistrations =
    optimismGoerliData?.registrationNetwork?.registrations || [];
  const optimismRegistrations =
    optimismData?.registrationNetwork?.registrations || [];
  const gnosisRegistrations =
    gnosisData?.registrationNetwork?.registrations || [];
  const arbitrumGoerliRegistrations =
    arbitrumGoerliData?.registrationNetwork?.registrations || [];
  const chapelRegistrations =
    chapelData?.registrationNetwork?.registrations || [];
  const allRegistrationInstances = mainnetRegistrations.concat(
    mainnetv0Registrations,
    goerliRegistrations,
    gnosisRegistrations,
    optimismGoerliRegistrations,
    arbitrumGoerliRegistrations,
    chapelRegistrations,
    optimismRegistrations
  );

  const registrationInstances = allRegistrationInstances.filter(
    (instance) => !registrationIdsToFilter.includes(instance.id)
  );

  return (
    <WagmiConfig config={client}>
      <ConnectKitProvider
        mode="dark"
        customTheme={{
          "--ck-font-family":
            "IBM Plex Mono, 'Roboto Condensed', 'Roboto', 'Arial', sans-serif",
        }}
        options={{
          hideNoWalletCTA: true,
          walletConnectName: "WalletConnect",
          showAvatar: false,
          hideQuestionMarkCTA: true,
        }}
      >
        <div className="App">
          <TopNavigation />
          {/* <Homepage /> */}

          <Routes>
            <Route path="/eye" element={<Eye />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration/:regID" element={<RegistrationPage />} />
            <Route
              path="/explore"
              element={
                <ExplorePage registrationInstances={registrationInstances} />
              }
            />
            <Route
              path="/"
              element={
                <Homepage registrationInstances={registrationInstances} />
              }
            />
            <Route
              path="/creative-universe"
              component={() => {
                window.location.href =
                  "https://github.com/metagov/daostar/discussions/41";
                return null;
              }}
            />
          </Routes>
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

if (window.location.path === "creative-universe") {
  window.location = "https://github.com/metagov/daostar/discussions/41";
}

export default App;