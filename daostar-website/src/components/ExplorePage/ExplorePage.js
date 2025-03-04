import React, { useEffect, useState } from "react";
import RegistrationLeanCard from "../RegistrationCard/RegistrationLeanCard";
import AttestationCard from "../AttestationCard/AttestationCard";
import ENSCard from "../ENSCard/ENSCard";
import "./ExplorePage.css";
import { InputGroup, Button } from "@blueprintjs/core";
import { filterEASbyAttester, filterEASbyId } from "../FilterRegistrations/Filter_Registrations_By_Id";
import RegistrationCard from "../RegistrationCard/RegistrationCard";

// Filtering logic
export const filterRegistrations = (registration, filterVal = "") => {
  if (!registration.daoName?.trim()) return false;
  if (registration.daoAddress?.toLowerCase() === "0xdeb9e5915db81011c549799a9ea37ede4d72efba") return false;

  const daoNameLower = registration.daoName.toLowerCase();
  const filterWords = ["scam", "test", "fuck"];

  if (filterWords.some((word) => daoNameLower.includes(word))) return false;

  return filterVal === "" || daoNameLower.includes(filterVal.toLowerCase());
};

// Network Filtering Logic
export const NetworkFilterRegistrations = (registration, filterVal = "") => {
  if (!registration.registrationNetwork) return false;
  const { id, daoAddress } = registration.registrationNetwork;

  if (daoAddress?.toLowerCase() === "0xdeb9e5915db81011c549799a9ea37ede4d72efba") return false;
  if (id === filterVal) return true;
  if (filterVal === "ethereum" && (id === "ethereum" || id === "mainnet")) return true;

  return false;
};

const NetworkButtons = [
  { text: "All", filter: "all" },
  { text: "Arbitrum", filter: "arbitrum-one" },
  { text: "BNB Bruno", filter: "chapel" },
  { text: "Ethereum", filter: "ethereum" },
  { text: "Gnosis", filter: "gnosis" },
  { text: "Juno", filter: "juno" },
  { text: "Optimism", filter: "optimism" },
  { text: "Optimism-Sepolia", filter: "optimism-sepolia" },
  { text: "Osmosis", filter: "osmosis" },
  { text: "Stargaze", filter: "stargaze" },
  { text: "EAS", filter: "easAttestations" },
  { text: "ENS", filter: "ensTextRecords" },
].sort((a, b) => a.text.localeCompare(b.text));

const ExplorePage = ({
  registrationInstances,
  junosInstances,
  osmosisInstances,
  stargazeInstances,
  easAttestations,
  ENSTextRecords,
  sunriseNetworkInstances
}) => {
  const [filterVal, setFilterVal] = useState("");
  const [networkFilter, setNetworkFilter] = useState("all");

  const onChangeFilter = (e) => setFilterVal(e.target.value);

  const isValidDaoURI = (daoURI) => {
    return (
      (daoURI?.startsWith("ipfs://") && daoURI.length >= 53) ||
      (daoURI?.startsWith("https://ipfs.io/ipfs/") && daoURI.length >= 67)
    );
  };

  const filteredRegistrationsSunrise = (instances, networkFilterValue = "") => {
    if (!Array.isArray(instances)) return [];

    return instances
      .filter((reg) => 
        reg.daoAddress?.toLowerCase() !== "0xdeb9e5915db81011c549799a9ea37ede4d72efba" &&
        isValidDaoURI(reg.daoURI) &&
        (networkFilterValue === "" || reg.registrationNetwork?.id === networkFilterValue)
      )
      .map((registration, i) => <RegistrationLeanCard key={i} {...registration} />);
  };

  const filteredRegistrations = (instances) =>
    instances?.flatMap((network) =>
      network.registrationNetwork.registrations
        .filter((reg) => filterRegistrations(reg, filterVal))
        .map((reg, i) => <RegistrationCard key={i} {...reg} standalone displayWithoutEdit />)
    ) || [];

  const filteredEVMRegistrations = registrationInstances
    .filter((reg) => NetworkFilterRegistrations(reg, networkFilter) && filterRegistrations(reg, filterVal))
    .map((reg, i) => <RegistrationLeanCard key={i} {...reg} />);

  const renderCards = () => {
    if (networkFilter === "all") {
      return [
        ...filteredRegistrationsSunrise(sunriseNetworkInstances, ""),
        ...filteredRegistrations(junosInstances),
        ...filteredRegistrations(osmosisInstances),
        ...filteredRegistrations(stargazeInstances),
        ...filteredEVMRegistrations,
      ];
    }

    switch (networkFilter) {
      case "juno":
        return filteredRegistrations(junosInstances);
      case "osmosis":
        return filteredRegistrations(osmosisInstances);
      case "stargaze":
        return filteredRegistrations(stargazeInstances);
      case "arbitrum-one":
        return filteredRegistrationsSunrise(sunriseNetworkInstances, "arbitrum-one");
      case "chapel":
        return filteredRegistrationsSunrise(sunriseNetworkInstances, "chapel");
      case "gnosis":
        return filteredRegistrationsSunrise(sunriseNetworkInstances, "gnosis");
      case "ethereum":
        return filteredRegistrationsSunrise(sunriseNetworkInstances, "mainnet");
      case "optimism":
        return filteredRegistrationsSunrise(sunriseNetworkInstances, "optimism");
      case "optimism-sepolia":
        return filteredRegistrationsSunrise(sunriseNetworkInstances, "optimism-sepolia");
      case "easAttestations":
        return easAttestations
          .filter((attestation) => 
            !filterEASbyAttester.includes(attestation.attester) &&
            !filterEASbyId.includes(attestation.id)
          )
          .map((attestation, i) => <AttestationCard key={i} {...attestation} />);
      case "ensTextRecords":
        return ENSTextRecords.map((textRecord, i) => <ENSCard key={i} {...textRecord} />);
      default:
        return filteredEVMRegistrations;
    }
  };

  return (
    <div className="explore-page">
      <div className="filter">
        <InputGroup
          large
          placeholder="Filter DAOs..."
          value={filterVal}
          onChange={onChangeFilter}
        />
        <div>
          {NetworkButtons.map((button) => (
            <Button
              key={button.filter}
              text={button.text}
              onClick={() => setNetworkFilter(button.filter)}
              className={networkFilter === button.filter ? "button-highlighted" : ""}
            />
          ))}
        </div>
      </div>
      <div className="dao-cards">{renderCards()}</div>
    </div>
  );
};

export default ExplorePage;
