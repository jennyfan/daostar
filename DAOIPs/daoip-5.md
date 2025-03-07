---
daoip: 5
title: Grants Management
description: Data standards for grants systems
discussions-to: https://github.com/metagov/daostar/discussions/51
status: Draft
type: 
category: 
author: Joshua Tan <josh@metagov.org>, Tyler Sullberg <tysullberg@gmail.com>, Eugene Leventhal <eugene@metagov.org>, Kevin Olsen <kevinolsen@gitcoin.co>, Riccardo Lamanna
created: 2023-11-14
---

# Simple summary
Schemas and attestations for grants management.

# Motivation
As the Web3 space has grown in recent years, grant programs run by protocols and projects have themselves exploded in size and popularity. Over a billion dollars in capital have been deployed or committed, grant programs have come and gone, and many organizations are now assessing the progress and impact of their issued funding. 

There have been [a wide range of approaches](https://docs.google.com/document/d/1CFD6ztSh2ggJSO-U3uEea92UVB1cRbvBlA1tfPxLKi8/edit?usp=sharing), from transparent (e.g. Aave) or closed (e.g. Ethereum Foundation and Solana Foundation) to communally architected (e.g. Stacks Foundation) to being launched by a compensated team (e.g. Mantle), from prospective (e.g. Uniswap Foundation) to retroactive (e.g. Optimism) to research-focused (e.g. Protocol Labs Research Grants) to quadratically funded (e.g. Gitcoin), to RFP-based (i.e. Protocol Labs, Uniswap Foundation, Solana Foundation, etc.). The diversity of thought on how to best run such programs has led to innovative approaches for grants management but has also fragmented capital and reduced transparency.

This specification lays out a set of off-chain data schemas for grant programs looking to deploy funding and for projects looking to receive funding, as well as a simple attestations architecture. It is intended to increase interoperability between grants tooling, improve the transparency of grant programs, and ultimately make grant programs more efficient for funders, administrators, and grantees. In particular, this specification lays the groundwork for a “common application” for grants as well as easier coordination between grants programs.

# Specification
The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

This specification is organized into four main components:
1. Grant systems
2. Grant pools
3. Projects
4. Applications

While eligibility and compliance flows (including KYC) are important in grants systems, we decided to not include them within the scope of the current specification. Similarly, we have decided not to standardize interactions with voting and payout systems, though these are also common aspects of grants.

![](https://green-beautiful-basilisk-157.mypinata.cloud/ipfs/QmUJWUd25iybU3qXxM6ATAnXmvv3pGQ6bEPLubuLDYqoh3)

## Grants systems
A grants system represents the top-level governance or administration of a grant pool or grant program, typically identified as an organization such as a foundation or DAO. All organizations and entities adopting DAOIP-5, even those not deployed or organized as DAOs, MUST publish a daoURI with the additional field `grantPoolsURI` either via DAOIP-2 or through a trusted issuer via DAOIP-3. This bootstraps indexing and discovery of grant pools via the existing on-chain indexing infrastructure for daoURI.

```json
{
    "@context": "http://www.daostar.org/schemas",
    "name": "<The name of the entity.>",
    "type": "<The entity type, e.g. DAO or Foundation.>",
    "grantPoolsURI": "<A URI pointing to a JSON declaring any grant pools maintained by the entity, following the DAOIP-5 Grant Pool JSON-LD Schema.>",
}
```

## Grant pools
A grant pool is a smart contract or other fundable object containing funds with the intention of being used to pay out grants. In this specification, a grant pool is defined to be a subtype of a contract in the sense of [DAOIP-2](daoip-2.md). This means that on-chain grant pools MUST publish an id of the form `CAIP10_ADDRESS + "?contractId=" + CONTRACT_COUNTER`, where `CAIP10_ADDRESS` is the CAIP-10 address of the grant system and `CONTRACT_COUNTER` is an arbitrary identifier such as a uint256 counter or a hash that is locally unique per CAIP-10 address. Off-chain grant pools MAY use a similar id format where `CAIP10_ADDRESS` is replaced with an appropriate URI or URL. 

Unless otherwise noted, all fields in the Grant Pool JSON-LD Schema are REQUIRED. In particular, a grant pool MUST publish an `applicationsURI` field, which is described in more detail in the Applications section, below. If a grant system operates multiple grant pools, they MAY add additional elements to the array below.

Grant Pool JSON-LD Schema
```json
{
    "@context": "http://www.daostar.org/schemas",
    "name": "<name of the entity>",
    "type": "<entity type, e.g. DAO or Foundation>",
    "grantPools": [
        {
            "type": "GrantPool",
            "id": "<The id of the grant pool, in the format above.>",
            "name": "<The name of the grant pool.>",
            "description": "<A description of the grant pool.>",
            "grantPoolType" : "<OPTIONAL : A text value indicating the type of funding mechanism used for this grant pool>"
            "isOpen": <OPTIONAL: A Boolean true/false indicating whether the grant pool is open to or seeking new applications.>,
            "closeDate": "<OPTIONAL: The ISO DateTime at which point the grant pool will stop taking new applications.>",
            "applicationsURI": "<A URI pointing to current and past applications received by the grant pool, following the DAOIP-5 Applications JSON-LD Schema.>",
            "governanceURI": "<A URI pointing to additional information about the governance, requirements, and criteria for the grant, which SHOULD be a .md file.>",
            "attestationIssuersURI": "<RECOMMENDED: A URI pointing to a JSON of trusted issuers of attestations and credentials about the grant pool, following the DAOIP-3 Attestation Issuers JSON-LD Schema.>",
            "requiredCredentials": ["<RECOMMENDED: An array of attestation types, following DAOIP-3 Attestations for DAOs.>"],
            "email": "<OPTIONAL: A working email address through which the grant pool can respond to inquiries and requests.>",
            "image": "<RECOMMENDED: A URI pointing to a resource with mime type image/*, typically a square logo.>",
            "coverImage": "<RECOMMENDED: A URI pointing to a resource with mime type image/*, typically a large, rectangular background image.>"
        }
    ]
}
```

## Projects
Projects represent persistent projects, teams, or individuals that intend to submit applications to one or more grant pools or programs. In this specification, a project represents the “common” portion of an application for grant funding. In other words, to publish a `projectsURI` is to create an open application for funding.

For efficient indexing, all projects adopting DAOIP-5, even individuals and teams not organized as DAOs, MUST publish a daoURI with the additional field "projectsURI" either via DAOIP-2 or through a trusted issuer via DAOIP-3. 

```json
{
    "@context": "http://www.daostar.org/schemas",
    "name": "<name of the entity>",
    "type": "<entity type, e.g. DAO or Person>",
    "projectsURI": "<A URI pointing to a JSON of projects seeking grant funding following the DAOIP-5 Projects JSON-LD Schema.>"
}
```

In this specification, a project is a subtype of a proposal in the sense of [DAOIP-2](DAOIP-2.md). This means that on-chain projects MUST publish an id of the form `CAIP10_ADDRESS + "?proposalId=" + PROPOSAL_COUNTER`, where `CAIP10_ADDRESS` is the CAIP-10 address of the proposing team or individual and `PROPOSAL_COUNTER` is an arbitrary identifier such as a uint256 counter or a hash that is locally unique per CAIP-10 address. Off-chain projects MAY use a similar id format where `CAIP10_ADDRESS` is replaced with an appropriate URI or URL. 

Unless otherwise noted, all fields in the Projects JSON-LD Schema are REQUIRED.

Projects JSON-LD Schema
```json
{
    "@context": "http://www.daostar.org/schemas",
    "name": "<name of the entity>",
    "type": "<entity type, e.g. DAO or Person>",
    "projects": [
        {
        "type": "Project",
        "id": "<The id of the proposal, in the format specified above.>",
        "name": "<The name of the project.>",
        "description": "<A description of the project.>",
        "contentURI": "<A longer description of the project forming the core of a pitch for the project, including such things as activities proposed, milestones, team, impact assessment, past history, contact information, and so on.>",
        "email": "<OPTIONAL: A working email address through which the project can respond to grant inquiries and requests.>",
        "membersURI": "<OPTIONAL: A URI pointing to a JSON of members of the project, following the DAOIP-2 Members JSON-LD Schema.>",
        "attestationIssuersURI": "<RECOMMENDED: A URI pointing to a JSON of trusted issuers of attestations and credentials about the project and its members, following the DAOIP-3 Attestation Issuers JSON-LD Schema.>",
        "relevantTo": "<OPTIONAL: An array of (GrantPool id, GrantPool name) intended to call attention to specific grant pools for which this project is relevant. This does not constitute a formal grant application unless recognized by the grant pool.>",
        "image": "<RECOMMENDED: A URI pointing to a resource with mime type image/*, typically a square logo.>",
        "coverImage": "<RECOMMENDED: A URI pointing to a resource with mime type image/*, typically a large, rectangular background image.>",
        "openSourceStatus": "<OPTIONAL: A Boolean or Text value indicating the Open-Source Status of the project>",
        "socials": [
                {
                "name": "<The name of the social platform>",
                "value":  "<An URI of the social platform profile of the project"
                } 
            ]
        }
    ]
}
```

Following [DAOIP-3](DAOIP-3.md), a project, just like a DAO, SHOULD name a number of issuers who are trusted to publish verifiable credentials and other attestations on behalf of the project and its members. These attestations form an important and often required part of a project’s application. For example, different issuers may publish attestations related to the verified identity of a project, ownership over a Twitter or GitHub account, the work history of its members, as well as email contact information and other forms of personally-identifiable information.

## Applications
When a project applies for a grant from a particular grant pool or when a grant pool records a project for funding consideration, it is called a grant application or application to that pool.

In this specification, an application is a subtype of `Proposal` in the sense of [DAOIP-2: Common Interfaces for DAOs](DAOIP-2.md). This means that on-chain applications MUST publish an id of the form CAIP10_ADDRESS + "?proposalId=" + PROPOSAL_COUNTER, where CAIP10_ADDRESS is the CAIP-10 address of the grant pool and PROPOSAL_COUNTER is an arbitrary identifier such as a uint256 counter or a hash that is locally unique per CAIP-10 address. Note that applications to the grant pool MAY count as proposals to the larger entity maintaining the grants system; if so, that choice SHOULD be reflected in the design of PROPOSAL_COUNTER. Off-chain proposals MAY use a similar id format where CAIP10_ADDRESS is replaced with an appropriate URI or URL.

Every grant system and grant pool adopting DAOIP-5 MUST publish an applicationsURI which returns the id, name, and description of all pending and past applications to the grant pool, following the schema below. Other application data MAY be published by the grant pool or system.

Applications JSON-LD Schema
```json
{
    "@context": "http://www.daostar.org/schemas",
    "name": "<name of the entity>",
    "type": "<type of the entity, e.g. DAO or Foundation>",
    "grantPools": [
        {
            "type": "GrantPool",
            "name": "<The name of the grant pool.>",
            "applications": [
                {
                    "type": "GrantApplication",
                    "id": "<The uid of the proposal, in the format specified above.>",
                    "grantPoolsURI": "<A URI pointing to the grant pools published by the entity.>",
                    "grantPoolId": "<The id of the grant pool.>",
                    "grantPoolName": "<The name of the grant pool.>",
                    "projectsURI": "<The URI of an organization’s projects applying for grant funding.>",
                    "projectId": "<The id of the project.>",
                    "projectName": "<The name of the project.>",
                    "createdAt": "<ISO DateTime>",
                    "contentURI": "<A URI pointing to the publicly accessible content of the application.>",
                    "discussionsTo": "<OPTIONAL: A URI pointing to a fixed channel, e.g. a forum discussion thread or messaging chat, where the granter(s), grantee(s), and other stakeholders can discuss the grant.>",
                    "openSourceStatus": "<OPTIONAL: A Boolean or Text value indicating the Open-Source Status of the project>",
                    "isInactive": "<OPTIONAL: A Boolean value to indicate if the project is inactive>",
                    "submissionCompleteRate": "<OPTIONAL: A Numeric value between 0-100 to indicate the percentage of application completion>",
                    "socials": [
                        {
                            "platform": "<Enum value: Twitter | Discord | Telegram | LinkedIn | GitHub | Farcaster | Lens>",
                            "url": "<The URI of the project's profile on the specified platform>"
                        }
                    ],
                    "applicationCompletionRate": "<OPTIONAL: A Percentage value of project completion status of the Grant Application>",
                    "fundsAsked": [
                        {
                            "amount": "<The amount of funding asked>",
                            "denomination": "<The denomination of currency asked>"
                        }
                    ],
                    "fundsAskedInUSD": "<OPTIONAL: The amount of funding asked normalized to USD>",
                    "fundsApproved": [
                        {
                            "amount": "<The amount of funding approved>",
                            "denomination": "<The denomination of currency approved>"
                        }
                    ],
                    "fundsApprovedInUSD": "<The amount of funding approved normalized to USD>",
                    "payoutAddress": {
                        "type": "<e.g. EthereumAddress, CAIP10Address, IBAN, SWIFT/BIC, etc.>",
                        "value": "<subject's identifier, e.g. their Ethereum address, CAIP-10 address, IBAN, etc.>"
                    },
                    "status": "<Enum value: pending | in_review | approved | funded | rejected | completed>",
                    "payouts": [
                        {
                            "type": "<The type of the payout transaction, e.g., CallDataEVM, StripePayment, InvoicePayment, OnchainTransaction>",
                            "value": {
                                "<Details specific to the payout type, such as operation, from, to, value, data, and other relevant transaction details>"
                            },
                            "proof": "<Evidence of the payout, such as a transaction hash, payment ID, or a link to verify the payout>"
                        }
                    ],
                    "totalGrantPoolSize": [
                        {
                            "amount": "<The total amount of funding for the grant pool>",
                            "denomination": "<The denomination of currency>"
                        }
                    ]
                }
            ]
        }
    ]
}
```

# Rationale
The intention of this specification is to facilitate easier aggregation, transparency, and coordination across grant systems, and can be thought of as an architecture for building and maintaining a shared, distributed database of grant opportunities and grant applications. It is not intended to specify precise onchain implementations of grant pools. The standard is designed to support a variety of use-cases, from improved methods for tracking grantee awards and payouts, to impact measurement, to more consistent credentialing and reputation (including reuse of credentials), to fostering more co-funding / limiting 'grant farming', to a common application across grant pools.

In particular, we hope that this specification will foster more collaboration across grant programs, and make it easier to maintain those collaborations. While there has been some inter-program collaboration, many of these efforts are driven socially rather than programmatically, at scale.

## Example: a common application
Suppose Chiyo has an idea for an open-source project, “Shoes Protocol”, and wants to apply to three grant pools: Optimism via Charmverse, the Ethereum Foundation via their in-house system, and a Gitcoin grant round. Assume that Charmverse, Ethereum Foundation, and Gitcoin have all adopted DAOIP-5, i.e are publishing a `grantPoolsURI` as part of daoURI.

To apply, Chiyo first publishes a projectURI. She can do this by deploying a daoURI registration contract following daoURI, or by filling out a form via an issuer like Gitcoin or Charmverse in order to publish a projectURI (and daoURI) as an attestation.

In this case, Chiyo uses Gitcoin to publish. Following DAOIP-3, Gitcoin deploys the following on-chain attestation via EAS, which is then signed by Chiyo:

```json
{
  "sig": {
    "domain": {
      "name":"EASAttestation",
      "version":"0.26",
      "chainId":1,
      [...],
      "signature":{[...]},
      "uid":"0xabcd1234",
      "message":{
      "version":1,
      "schema":"0x123schemahash456",
      "recipient":"0x0000000000000000000000000000000000000000",
      "time":1234567890,
      "expirationTime":10000,
      "refUID":"0x0000000000000000000000000000000000000000000000000000000000000000",
      "revocable":false,
      "data":"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001234abcd0000000000000000000000000000",
      "nonce":0
    }
  },
  "signer":"0x1234abcd"
}
```

Effectively, the data decodes into a string representing the address of Chiyo’s daoURI, as generated by Gitcoin as Chiyo’s issuer. Let’s say that Chiyo’s daoURI is now https://gitcoin.co/attestations/ChiyoShark13/daoURI/. Going to her `daoURI` then returns the following:

```json
{
    "@context": "http://www.daostar.org/schemas",
    "type": "Person",
    "id": "eip155:1:0x1234abcd",
    "name": "ChiyoShark13",
    "projects": [
        {
            "type": "Project",
            "id": "eip155:1:0x1234abcd?proposalId=1",
            "name": "Shoes Protocol",
            "description": "We help people move around and understand each other.",
            "contentURI": "https://gitcoin.co/projects/0xabcd1234cdef/",
            "email": "chiyo.shark13@coolprojects.com>",
            "membersURI": "",
            "attestationIssuers": [
                {
                    "type": "AttestationIssuer",
                    "name": "Gitcoin",
                    "issuer": "https://gitcoin.co/attestations/",
                }
            ],
            "relevantTo": "",
            "image": "",
            "coverImage": ""
        }
    ],
}
```

Chiyo has now published a public project profile through Gitcoin, which is further indexed through her `daoURI`. Note that, in this case, Gitcoin has replaced `projectsURI` with `projects` (i.e. embedded the data from `projectsURI` directly into the JSON returned by `daoURI`) and `attestationIssuersURI` with `attestationIssuers` so that we do not need to break apart the data into three separate JSON requests.

Now that Chiyo’s data is published through daoURI, it is indexed through publicly-available indexers and subgraphs and can be read by Charmverse and the Ethereum Foundation, among other grants. However, Chiyo has not yet applied to any grants.

In order for Chiyo to apply for grants, one of two things need to happen: she can apply directly to the grant pool using her profile, OR a grant pool can generate an application for her automatically based on analysis of her profile, grant content, and/or attestations and credentials.

In this case, she manually applies to two grant pools that she finds through Gitcoin’s interface: the Web3 Community grant round, and the Metagov Research grant round. Once she applies, Gitcoin publishes the following information for the Web3 Community grant round as Gitcoin is supplying the funds for the grants and is the grant manager via their platform and Allo protocol:

```json
{
    "@context": "http://www.daostar.org/schemas",
    "name": "Gitcoin",
    "type": "DAO",
    "grantPools": [
        {
            "type": "GrantPool",
            "id": "eip155:424:0x1234abcd",
            "name": "Web3 Community",
            "applications": [
                {
                    "type": "GrantApplication",
                    "id": "eip155:424:0x1234abcd?proposal=94",
                    "grantPoolsURI": "https://explorer.gitcoin.com/rounds/",
                    "grantPoolId": "eip155:424:0x1234abcd",
                    "grantPoolName": "Web3 Community",
                    "projectsURI": "https://gitcoin.co/attestations/ChiyoShark13/daoURI/",
                    "projectId": "eth:0x1234abcd?proposalId=1",
                    "projectName": "Shoes Protocol",
                    "createdAt": "023-11-14T15:52:25Z",
                    "contentURI": "https://gitcoin.co/projects/0x000xyz987",
                    "discussionsTo": "",
                    "fundsAsked": [
                        {
                            "amount": "",
                            "denomination": ""
                        }
                    ],
                    "fundsApproved": [
                        {
                            "amount": "",
                            "denomination": ""
                        }
                    ],
                    "payoutAddress": {
                    	"type": "EthereumAddress",
                    	"value": "0x1234abcd"
                    },
                    "isEligible": true,
                    "isReviewed": false,
                    "isApproved": false,
                    "isPaid": false,
                    "payouts": "",
                }
            ]
        },
```
Then via DAOIP-3 (Gitcoin is an attested party for both Metagov and Chiyo), Gitcoin publishes the following information for the Metagov Research grant round because the grant system here is Metagov as they are providing the funds while Gitcoin is the grant manager:

```json
{
    "@context": ["https://www.w3.org/ns/credentials/v2", "https://www.daostar.org/schemas"],
        "type": ["VerifiableCredential", "Attestation", "GrantPoolAttestation"],
    "issuer": "https://explorer.gitcoin.com/attestationIssuers/gitcoin", 
    "attestationURI": "https://explorer.gitcoin.com/attestations/metagov",
    "expirationDate": "2024-12-31T23:59:59Z",
    "grantPools": [
        {
            "type": "GrantPool",
            "id": "eip155:1:0x2345bcde",
            "name": "Metagov Research",
            "applications": [
                {
                    "type": "GrantApplication",
                    "id": "eip155:424:0x1234abcd?proposal=94",
                    "grantPoolsURI": "https://explorer.gitcoin.com/rounds/",
                    "grantPoolId": "eip155:1:0x2345bcde",
                    "grantPoolName": "Metagov Research",
                    "projectsURI": "https://gitcoin.co/attestations/ChiyoShark13/daoURI/",
                    "projectId": "eth:0x1234abcd?proposalId=1",
                    "projectName": "Shoes Protocol",
                    "createdAt": "023-11-14T15:52:25Z",
                    "contentURI": "https://gitcoin.co/projects/0x000uvw678"
                    "discussionsTo": "",
                    "fundsAsked": [
                        {
                            "amount": "5000",
                            "denomination": "USDC"
                        }
                    ],
                    "fundsApproved": [
                        {
                            "amount": "",
                            "denomination": ""
                        }
                    ],
                    "payoutAddress": {
                    	"type": "EthereumAddress",
                    	"value": "0x1234abcd"
                    },
                    "isEligible": true,
                    "isReviewed": false,
                    "isApproved": false,
                    "isPaid": false,
                    "payouts": "",
                }
            ]
        }
    ]
}
```

## Grants system
A grants system is simply the DAO, foundation, or other organization that governs a grant pool.

We contemplated introducing an additional grants system schema to help organizations manage multiple grant pools (e.g. as part of a yearly grant or a fundraising round). But there are many potential management schemes for grant pools. Rather than introduce additional fields and architecture to support these systems, we decided to abstract that functionality into the organization / DAO itself and require only that it publish a `grantPoolsURI` field. In other words, while we expect roles, permissions, and decision-making procedures to be defined at the level of a grant system, we decided not to include those in this specification because (1) we did not want to enforce a specific on-chain implementation of roles and permissions and (2) roles and permissions are sufficiently modular that they can specified in a separate specification.

We also considered having grant pools publish a `managerURI` field that, normatively, points at a daoURI, but there is no established pattern for declaring links or relationships between contracts and it was beyond the scope of this specification to do so.

Note that multiple organizations may report the same grant pool (and assign the same grant pool different ids).

## Grant pool
The proposed grant pool design is designed to facilitate clear publication of the behavior, eligibility and decision-making criteria, and performance of grant pools while remaining flexible with respect to many different program designs including Gitcoin-style “rounds”, rolling applications/funding periods, retroactive funding, custom payout and refund logic, bounty programs and hackathons, and so on.

In general, our design expects grant pools to publish significantly more ongoing performance information than projects. In this way, we pose grant pools as objects somewhat similar to investment portfolios. This is for two reasons: (1) to help potential applicants sort through relevant grant pools and (2) to foster productive forms of transparency in grants administration, especially to external donors, community governance, and fund partners. We believe this will lead to both more professionalization in grants administration and stronger outcomes from grants. Grant pools also occupy a clear position of power vis-a-vis projects, and can thus affect the behavior of many projects. By using this power wisely, a relatively small group of grant pools can create systematic change in the entire ecosystem.

We considered restricting the scope of grant pools to just on-chain instruments, i.e. those with a unique CAIP-10 address. Ultimately it was not difficult to extend the specification to other fundable objects as well, e.g. Paypal accounts, Stripe wallets, Open Collective collectives, and traditional bank accounts.

We considered adding an optional allowlist for both tokens and funders. The funder allow list can be important for KYC while the token allowlist allows an organization to control what kinds of contributions can be made to the grant pool (e.g. only stablecoins and the native token of the DAO). We decided that these fields could be added and tested in future specifications.

## Projects
Applications to a grant pool are very similar to generic proposals to a DAO. However, individual projects often apply to multiple grant pools or multiple times to a single grant pool, for example multiple Gitcoin rounds or a co-funding round for a public good supported by many DAOs. For this purpose, we define projects separately from applications, and store them as an additional form of metadata attached to the entity, organization, or DAO that hosts (and in principle, executes) the project. Note, however, that the majority of projects are proposals to _another_ entity, i.e. a grant pool, rather than to the entity that hosts the project.

A project can be understood as representing the common, public portion of an organization’s grant application, whereas an application represents a particular proposal, at a specific time, by a particular project, to a particular grant pool. Project metadata contains the information that will be common between all applications (e.g. description, website, credentials, etc), while application metadata contains information relevant for that particular grant pool (e.g. responses to particular grant applications, the status of the application, etc.).

Projects can accumulate history and reputation (i.e. attestations) either on their own or as part of their host entity.

Project data reduces the amount of redundant information that needs to be entered on each application. Insofar as an entity can either self-host (through daoURI) or published their project information through their preferred platform / issuer rather than across many, the data also helps maintain up-to-date data across grants. Project data also helps grant pools to actively seek out projects rather than only passively accepting applications. 

Originally, we intended projectsURI to be published by a grant system operator, i.e. as a list of projects who had applied. However, in contemplating a “common application” as well as co-funding grants, we decided to allow projectsURI to be published by the applicants themselves. This makes project creation and maintenance permissionless and decentralized (a project can point projectsURI at a Markdown file hosted anywhere, e.g. on GitHub), while allowing grant programs to organize their internal application data in whatever way makes sense to them.

A number of issues that we considered but either descoped or decided not to include:
- we considered specifying a full “common application” interface that makes it easier to submit and vet applications as well as fields that might be useful for such a common application, but decided not to because it could be better scoped in another standard.
- it was tempting to define projects as reflections of grant pools, i.e. as smart contracts or fundable objects with the intention of being used to receive grants. Ultimately, we decided that it was more essential that a “project” in this specification reflect the actual project rather than the vehicle through which the project receives or manages funds. Further, projects may require all sorts of complicated payout schemes (escrow, multiple parties) that may not reflect a single payout address.
- we did not resolve in this specification whether to attach, how to attach, and how to validate the grant history of a project, e.g. through a “previousSuccessfulProposals” field. Currently, for example Gitcoin does this with subgraphs, though the history is organized per grant pool rather than per project.

### Credentials, attestationIssuersURI, and membersURI
Credentials (e.g. ownership of a token or NFT, verification of Twitter ownership, verification of GitHub repository ownership) are important parts of a grant application, as they can serve as effective forms of gating and anti-spam. Earlier versions of the standard included a `projectCredentialsURI` with an undefined schema for attestations, but this was phased out to adopt a cleaner `attestationIssuersURI` following DAOIP-3. `attestationIssuersURI` supports use-cases for verifications, but can also be easily extended to cover work history / profiles of the members, granting history, and other forms of reputation.

Similarly, we included membersURI so that attestations about members of the project (Web3 CVs, profiles, and reputatoin) can be automatically pulled and included in the project.

In asking projects to name only the issuers rather than provide the attestations themselves, we expect grant pools themselves to pull the requisite data (e.g. as named in the `requiredCredentials` field) from a project’s named issuers; it is then the responsibility of the project to make sure that these attestations are available.

### Privacy
It is often convenient to associate an email address to a project. We considered a few options for publishing emails, given that emails are often a form of private and personally identifiable information. In this specification, we decided that there is no expectation of privacy for emails published through this standard. Later standards, including future iterations of this specification, may choose to publish an encrypted email field as part of the Projects JSON and then attach a key or other data through which a grant pool operator can decrypt the field. Alternately, emails may be sent only through a private application and removed entirely from this specification.

## Applications
In general, applications can be dynamic, i.e. a funding ask may change over the course of an application or a joint applicant may drop out. Applications, unlike projects, may also be private, and include private information such as email addresses, KYC, and other forms of personally identifiable information. Most applications also require supplementary materials and answers to questions beyond that present in the project. We cannot and do not specify what all applications should look like.

A key component of the grant process that is missing in the current specification is a standard description of how applications may be submitted to a grant pool. Just as with generic proposals, there are many ways in which applications may submitted to a grant program (on-chain, forums, in-house systems, dedicated grant software, or form services such as Typeform or Google Forms, etc.).

An application can be thought of as a relation between one entity or DAO (the applicant) and another entity or DAO (the grant pool). We considered how to extend the proposal logic into a many-to-many relation, i.e. a proposal involving many projects (as in a joint application) as well as many grant pools (as in a co-funding round). While potentially useful, these transactions are much rarer than traditional grant applications. For the sake of scope we decided that this was better left for a different specification.

## Community consensus
The specification above was based on discussions by a large working group of industry operators including Gitcoin, Solana, Optimism, OpenQ, Clr.fund, Questbook, DaoLens, Station, and others, and at workshops located at ETH Denver 2023 and Devconnect 2023. It was also based on an extended study of different grant programs and grant tooling for DAOs and other Web3 projects.

# Acknowledgements
We are grateful for helpful comments and suggestions from Andrea Franz, Aditya Anand, Balazs Nemethi, Apoorv Nandan, Tina He, Carl Cervone, and Amandeep.

# Copyright
Copyright and related rights waived via CC0.
