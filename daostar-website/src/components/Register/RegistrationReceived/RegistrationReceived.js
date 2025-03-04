import React, { Fragment } from "react";
import { Button, Divider, FormGroup, TextArea } from "@blueprintjs/core";
import { useWeb3Modal } from "@web3modal/react";
import { ethers } from "ethers";
import RegistrationContract from "../../../abi/RegistrationContract";
import CopyField from "../../ui/CopyField/CopyField";

const RegistrationReceived = ({
  daoURI,
  daoContractAddress,
  daoContractNetwork,
  isUpdate = false,
}) => {
  const { isOpen, open } = useWeb3Modal();
  // Registration Summoner Contract Addresses
  const factoryContracts = {
    arbitrumOne: `0x5C0340AD34f7284f9272E784FF76638E8dDb5dE4`,
    mainnet: `0x2dac5dbbf1d024c1e0d9c92d3aeda7618e15add7`,
    gnosis: `0x4f2c9028fe7107d9f1a8a9cff34aa2d3f28600fa`,
    optimismSepolia:  '0x94eBB083b3e6c346A5115c54Ef0EA1125ED1377d',
    chapel:`0x5C0340AD34f7284f9272E784FF76638E8dDb5dE4`,
    optimism: `0x5C0340AD34f7284f9272E784FF76638E8dDb5dE4`,
      // polygon: `0x37dF3fC47C1c3A2acaFd2Dad9c1C00090a8655Bc`, //unsupported
    // goerli: `0x3271b3479f7485dadb2bd5fff43eeb4367b1a91a`, // deprecated
    // arbitrumGoerli: `0x5C0340AD34f7284f9272E784FF76638E8dDb5dE4`,
    // optimismGoerli: `0x45E81552DEC1F57c18E3cbd69549252624b96D98`,
  };

  const regContract = new ethers.Contract(
    `0x5ef59b7cDe41b744f36b6e07fEF230884F800529`,
    RegistrationContract
  );
  const saltNumber = Math.floor(100000000000 + Math.random() * 900000000000);
  const salt = `0x${saltNumber}0000000000000000000000000000000000000000000000000000`; // TODO: generate salt
  console.log("salt", salt);
  const managerExample = `0x5ef59b7cDe41b744f36b6e07fEF230884F800529`;
  const contracts = [];
  const bytes = [];
  const daoIPFS_URI = `ipfs://${daoURI.substring(
    daoURI.indexOf(`immutable/`) + 10
  )}`;
  console.log("ipfs", daoIPFS_URI);
  const regData = [salt, daoIPFS_URI, managerExample, contracts, bytes];
  const rawRegData = regContract.interface.encodeFunctionData(
    "summonRegistration",
    [...regData]
  );
// The below assignment is done because url cant handle '-' in the links
  if(daoContractNetwork === 'optimism-sepolia'){
    daoContractNetwork = 'optimismSepolia';
  }
  if(daoContractNetwork === 'arbitrum-goerli'){
    daoContractNetwork = 'arbitrumGoerli';
  }
  if(daoContractNetwork === 'arbitrum-one'){
    daoContractNetwork = 'arbitrumOne';
  }
  console.log(daoContractNetwork);
  return (
    <Fragment>
      <h3>
        {isUpdate ? "Updated registration received" : "Registration received!"}
      </h3>
      <Divider vertical={true} />
      <div className="wizard-row wizard-center">
        <p className="wizard-margin-bottom-8">Your DAO URI has been created.</p>
        <div className="wizard-margin-bottom-8">
          <CopyField text={daoURI} />
        </div>
        <p className="wizard-margin-bottom-8">
          To complete registration, propose this transaction to your DAO:
        </p>
        <Button
          disabled
          className="wizard-margin-bottom-8"
          intent="primary"
          text="Connect as DAO (coming soon)"
          onClick={open}
          loading={isOpen}
        />
      </div>
      <Divider vertical={true} />
      <div className="wizard-row">
        <p className="wizard-center">
          Or, manually copy transaction to your DAO:
        </p>
      </div>
      <div className="wizard-row">
        <FormGroup label="Address" labelFor="address">
          <CopyField
            id="address"
            fill={true}
            text={factoryContracts[daoContractNetwork]}
          />
        </FormGroup>
      </div>
      <div className="wizard-row">
        <FormGroup label="Salt" labelFor="value">
          <CopyField fill id="salt" text={salt} />
        </FormGroup>
      </div>
      <div className="wizard-row">
        <FormGroup label="DAO URI" labelFor="value">
          <CopyField fill id="daouri" text={daoIPFS_URI} />
        </FormGroup>
      </div>
  
      <div className="wizard-row">
        <FormGroup label="Function" labelFor="function">
          <CopyField
            fill
            id="function"
            text={`summonRegistration(bytes32 salt,string daoURI_,address manager,address[] contracts,bytes[] data)`}
          />
        </FormGroup>
      </div>
      <div className="wizard-row">
        <FormGroup label="Call Data" labelFor="call-data">
          <TextArea
            fill
            // disabled
            id="advanced-settings"
            value={rawRegData}
            growVertically
            style={{ minHeight: 200 }}
          />
        </FormGroup>
      </div>
    </Fragment>
  );
};

export default RegistrationReceived;
