import React from "react";
import ReactDOM from "react-dom/client";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { FocusStyleManager } from "@blueprintjs/core";
import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

FocusStyleManager.onlyShowFocusOnTabs();

function getLibrary(provider) {
    return new Web3Provider(provider);
}

const theGraphApiKey = process.env.REACT_APP_THEGRAPH_API_KEY;


const client = new ApolloClient({
    link: ApolloLink.from([
        new MultiAPILink({
            endpoints: {
                mainnet: `https://api.studio.thegraph.com/query/74263/daostar-mainnet/version/latest`,
                gnosis: `https://api.studio.thegraph.com/query/74263/daostar-gnosis/version/latest`,
                chapel:`https://api.studio.thegraph.com/query/74263/daostar-bnb-bruno/version/latest`, //bnb-bruno
                optimism: `https://api.studio.thegraph.com/query/74263/daostar-optimism/version/latest`,
                optimismSepolia: `https://api.studio.thegraph.com/query/74263/daostar-optimism-sepolia/v2.1`,
                ethereum: "https://api.thegraph.com/subgraphs/name/rashmi-278/daostar-ethereum-mainnet-v0",// ToDo: Need to redeploy
                arbitrum: "https://api.studio.thegraph.com/query/74263/daostar-arbitrum-one/version/latest",
                easOptimismSepolia:"https://optimism-sepolia.easscan.org/graphql",
                easOptimism:"https://optimism.easscan.org/graphql",
                ensTextRecords: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`
            },
            //defaultEndpoint: 'https://api.thegraph.com/subgraphs/name/ipatka/daostar',
            httpSuffix: "",
            createHttpLink: createHttpLink,
        }),
    ]),
    cache: new InMemoryCache({}),
});


root.render(
    <React.StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
            <BrowserRouter>
                <ApolloProvider client={client}>
                    <App />
                </ApolloProvider>
            </BrowserRouter>
        </Web3ReactProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
