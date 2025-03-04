import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Register from "./components/Register/Register";
import TopNavigation from "./components/TopNavigation/TopNavigation";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import ExplorePage from "./components/ExplorePage/ExplorePage";
import { WagmiConfig,createConfig } from "wagmi";
import { mainnet, optimism, sepolia, optimismSepolia, arbitrum, bscTestnet } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useQuery } from "@apollo/client";
import registrationIdsToFilter from "./components/FilterRegistrations/Filter_Registrations_By_Id";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import useAxios from "axios-hooks";
import queries from "./components/ExplorePage/queries/registrations";
import "./App.css";
import "./bp4-theme.css";
import Eye from "./components/Homepage/Eye/Eye";
import { useEffect, useState } from "react";
import axios from "axios";
import RegistrationLeanPage from "./components/RegistrationPage/RegistrationLeanPage";
import SchemaPage from "./components/SchemaPage/schemaPage";
import Research from "./components/Research/Research";
import GoogleAnalytics from './components/GoogleAnalytics/GoogleAnalytics';

const mainnetOldClient = new ApolloClient({
  link: createHttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/rashmi-278/daostar-ethereum-mainnet-v0",
  }),
  cache: new InMemoryCache(),
});

const alchemyId = process.env.REACT_APP_ALCHEMY_ID;
const walletConnectId = process.env.REACT_APP_WALLETCONNECT_ID;
const token = process.env.REACT_APP_BEARER_TOKEN;
const stargazeToken = process.env.REACT_APP_STARGAZE_BEARER_TOKEN;

const config = createConfig(
    getDefaultConfig({
      alchemyId: alchemyId,
      walletConnectProjectId: walletConnectId,
      appName: "DAOstar",
      chains: [optimism,mainnet,optimismSepolia,arbitrum,bscTestnet],
    })
);
// Define headers properly
const headers = {
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
};

const stargaze_headers = {
  "Content-Type": "application/json",
  ...(stargazeToken && { Authorization: `Bearer ${stargazeToken}` }),
};

const fetchAndStructureDAOs = async (apiUrl, network) => {
  try {
    const requestHeaders = network === "Stargaze" ? stargaze_headers : headers;
    const response = await axios.get(apiUrl, { headers: requestHeaders });
    const data = response.data;

    const itemsArray = network === "Stargaze" ? data.hits : data.results;

    return itemsArray?.map((item) => ({
      contractAddress: item.contractAddress,
      name: item.value.config.name,
      daoURI:
        item.value.config.dao_uri ||
        "https://daodao.zone/dao/" + item.contractAddress,
      description: item.value.config.description,
      id: item.value.voting_module,
      createdAt: new Date(item.value.createdAt),
      network: network,
      managerAddress: "",
      standalone: "true",
      membersURI:
        "https://daodao.zone/dao/" + item.contractAddress + "/members",
      activityLogURI: "https://daodao.zone/dao/" + item.contractAddress,
      issuersURI: "https://daodao.zone/dao/" + item.contractAddress,
      proposalsURI:
        "https://daodao.zone/dao/" + item.contractAddress + "/proposals",
      governanceURI:
        "https://daodao.zone/dao/" + item.contractAddress + "/subdaos",
    }));
  } catch (error) {
    console.error(`Error fetching ${network} data:`, error);
    return [];
  }
};

function restructureDAOData(daoInstances, networkId) {
  return [
    {
      registrationNetwork: {
        __typename: "RegistrationNetwork",
        id: networkId,
        registrations: daoInstances?.map((item) => ({
          __typename: "RegistrationInstance",
          id: item.id,
          daoName: item.name,
          daoAddress: item.contractAddress,
          daoDescription: item.description,
          daoURI: item.daoURI,
          governanceURI: item.governanceURI,
          issuersURI: item.issuersURI,
          managerAddress: item.managerAddress,
          membersURI: item.membersURI,
          proposalsURI: item.proposalsURI,
          registrationAddress: item.contractAddress,
          registrationNetwork: {
            __typename: "RegistrationNetwork",
            id: networkId,
          },
        })),
      },
    },
  ];
}

function App() {
  //DAODAOINT START
  const [daodaoInstances, setDaoDaoInstances] = useState([]);
  const [osmosisInstances, setOsmosisInstances] = useState([]);
  const [stargazeInstances, setStargazeInstances] = useState([]);

  useEffect(() => {
    const fetchDAOs = async () => {
      const daodaoData = await fetchAndStructureDAOs(
        "https://search.indexer.zone/indexes/daos/documents?limit=500",
        "Juno"
      );
      const osmosisData = await fetchAndStructureDAOs(
        "https://search.indexer.zone/indexes/osmosis_daos/documents?limit=500",
        "Osmosis"
      );
      const stargazeData = await fetchAndStructureDAOs(
        "https://search.indexer.zone/indexes/stargaze_daos/search?filter=value.config.name%20EXISTS&limit=501",
        "Stargaze"
      );

      setDaoDaoInstances(daodaoData);
      setOsmosisInstances(osmosisData);
      setStargazeInstances(stargazeData);

      const restructuredDaodao = restructureDAOData(daodaoData, "Juno");
      const restructuredOsmosis = restructureDAOData(osmosisData, "Osmosis");
      const restructuredStargaze = restructureDAOData(stargazeData, "Stargaze");

      setDaoDaoInstances(restructuredDaodao);
      setOsmosisInstances(restructuredOsmosis);
      setStargazeInstances(restructuredStargaze);
    };

    fetchDAOs();
  }, []);

  //DAODAOINT END
  const {
    loading,
    error,
    data: mainnetData,
  } = useQuery(queries.SUNRISE_REGISTRATIONS, {
    context: { apiName: "mainnet" },
    variables: { registrationNetworkId: "mainnet" },
    fetchPolicy: 'network-only',
  });
console.log("Mainnet DATA");
console.log(mainnetData);

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
  const optimismSepoliaRes = useQuery(queries.SUNRISE_REGISTRATIONS, {
    context: { apiName: "optimismSepolia" },
    variables: { registrationNetworkId: "optimism-sepolia" },
    fetchPolicy: 'network-only',
  });
  // TODO: Replace Goerli with Sepolia
  // const arbitrumGoerliRes = useQuery(queries.REGISTRATIONS, {
  //   context: { apiName: "arbitrumGoerli" },
  //   variables: { id: "arbitrum-goerli" },
  // });
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

  const gnosisRes = useQuery(queries.SUNRISE_REGISTRATIONS, {
    context: { apiName: "gnosis" },
    variables: { registrationNetworkId: "gnosis" },
    fetchPolicy: 'network-only',
  });

  const {
    loading: optimismLoading,
    error: optimismError,
    data: optimismData,
  } = optimismRes;

  const {
    loading: optimismSepoliaLoading,
    error: optimismSepoliaError,
    data: optimismSepoliaData,
  } = optimismSepoliaRes;
  // // const {
  // //   loading: arbitrumGoerliLoading,
  // //   error: arbitrumGoerliError,
  // //   data: arbitrumGoerliData,
  // // } = arbitrumGoerliRes;
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

  const arbitrumRes = useQuery(queries.SUNRISE_REGISTRATIONS, {
    context: { apiName: "arbitrum" },
    variables: { registrationNetworkId: "arbitrum-one" },
    fetchPolicy: 'network-only',
  });
  
  const {
    loading: arbitrumLoading,
    error: arbitrumError,
    data: arbitrumData,
  } = arbitrumRes;

  const EASOptimismSepoliaiRes = useQuery(queries.ATTESTATIONS_BY_SCHEMA, {
    context: { apiName: "easOptimismSepolia" },
    variables: {
      schemaId: "0x306fda1c3128d08699d4c5b4e3f397fa31c8f5927b0e751f40f45ee1273ac504",
    },
  });
  const {
    loading: EASOptimismSepoliaLoading,
    error: EASOptimismSepoliaError,
    data: EASOptimismSepoliaData,
  } = EASOptimismSepoliaiRes;
  console.log(EASOptimismSepoliaData)

  const EASOptimismRes = useQuery(queries.ATTESTATIONS_BY_SCHEMA, {
    context: { apiName: "easOptimism" },
    variables: {
      schemaId: "0x1b1837dfb994702896d5d19bb0d66cf16ea30d8523765b938ec029088f90f904",
    },
  });
  const {
    loading: EASOptimismLoading,
    error: EASOptimismError,
    data: EASOptimismData,
  } = EASOptimismRes;
  console.log(EASOptimismData)


  const ENSQueryRes = useQuery(queries.ENS_QUERY, {
    context: { apiName: "ensTextRecords" },
    variables: {
      "where": {
        "resolver_": {
          "texts_contains_nocase": ["daouri"]
        }
      },
      "first": null
    },
  });
  const {
    loading: ENSQueryResLoading,
    error: ENSQueryResError,
    data: ENSQueryResData,
  } = ENSQueryRes;
  console.log(ENSQueryResData)
  if (
    error ||
    goerliError ||
    optimismSepoliaError ||
    chapelError ||
    optimismError ||
    mainnetv0Error ||
    arbitrumError
  ) {
    console.error("Mainnet Error " + error);
    console.error("Mainnet v0 Error " + mainnetv0Error);
    console.error("Goerli Error " + goerliError);
    console.error("Optimism Sepolia Error " + optimismSepoliaError);
    console.error("Chapel Error" + chapelError);
    console.error("Optimism Error" + optimismError);
    console.error("Arbitrum Error" + arbitrumError);

  }
  if (
    loading ||
    goerliLoading ||
    gnosisLoading ||
    optimismSepoliaLoading ||
    chapelLoading ||
    optimismLoading ||
    arbitrumLoading
  )
    return "loading...";
  const mainnetRegistrations =
    mainnetData?.registrationNetwork?.registrations|| [];
  const mainnetv0Registrations =
    mainnetv0Data?.registrationNetwork?.registrations || [];
  const goerliRegistrations =
    goerliData?.registrationNetwork?.registrations || [];
 const optimismSepoliaRegistrations =
  optimismSepoliaData?.registrationNetwork?.registrations || [];
  const optimismRegistrations =
    optimismData?.registrationNetwork?.registrations || [];
  const gnosisRegistrations =
    gnosisData?.registrationNetwork?.registrations  || [];
  
  const arbitrumRegistrations =
    arbitrumData?.registrationNetwork?.registrations || [];
  const chapelRegistrations =
    chapelData?.registrationNetwork?.registrations || [];

  const EASOptimismSepoliaAttestations =
    EASOptimismSepoliaData?.attestations || [];

    const EASOptimismAttestations =
    EASOptimismData?.attestations || [];

    const ENSTextRecords =
    ENSQueryResData?.domains|| [];
  // This object clones and modifies the mainnetV0 registration instances to change the network ID to "ethereum"
  // So that when we click on an old registration instance card we are able to view and edit its proprties
  // this allows to query mainnetV0 subgraph link

  const allMainnetV0Registrations = mainnetv0Registrations?.map((instance) => ({
    ...instance,
    registrationNetwork: {
      ...instance.registrationNetwork,
      id: "ethereum",
    },
  }));

  const allRegistrationInstances = mainnetRegistrations.concat(
    allMainnetV0Registrations,
    goerliRegistrations,
    optimismSepoliaRegistrations,
    //arbitrumGoerliRegistrations,
    arbitrumRegistrations
  );

  const EASAttestations = EASOptimismAttestations.concat(EASOptimismSepoliaAttestations);
  const registrationInstances = allRegistrationInstances.filter(
    (instance) => !registrationIdsToFilter.includes(instance.id)
  );

  const sunriseNetworkInstances = gnosisRegistrations.concat(
    chapelRegistrations,
    mainnetRegistrations,
    arbitrumRegistrations,
    optimismRegistrations,

  );

  console.log({
    mainnetData,
    mainnetv0Data,
    goerliData,
    gnosisData,
    optimismSepoliaData,
    // arbitrumGoerliData,
    chapelData,
    arbitrumData,
  });

  return (
    <WagmiConfig config={config}>
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
          <GoogleAnalytics />
          <TopNavigation />
          {/* <Homepage /> */}

          <Routes>
            <Route path="/eye" element={<Eye />} />
            <Route path="/register" element={<Register />} />
            <Route path="/schemas" element={<SchemaPage />} />
            <Route path="/research" element={<Research />} />
            <Route path="/registration/:regID" element={<RegistrationPage />} />
            <Route path="/registration/l2/:regID" element={<RegistrationLeanPage />} />
            <Route
              path="/explore"
              element={
                <ExplorePage
                  registrationInstances={registrationInstances}
                  junosInstances={daodaoInstances}
                  osmosisInstances={osmosisInstances}
                  stargazeInstances={stargazeInstances}
                  easAttestations={EASAttestations}
                  ENSTextRecords={ENSTextRecords}
                  sunriseInstances={arbitrumRegistrations}
                  sunriseNetworkInstances={sunriseNetworkInstances}
                />
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
