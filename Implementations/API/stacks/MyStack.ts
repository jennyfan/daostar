import { Api, StackContext } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  // Create the HTTP API
  const api = new Api(stack, "Api", {
    routes: {
      "GET /molochv2/members/{network}/{id}":
        "functions/molochv2/getMembers.handler",
      "GET /molochv2/proposals/{network}/{id}":
        "functions/molochv2/getProposals.handler",
      // 'GET /molochv2/activities/{network}/{id}': 'functions/molochv2/getActivityLogs.handler',
      "GET /molochv3/members/{network}/{id}":
        "functions/molochv3/getMembers.handler",
      "GET /molochv3/proposals/{network}/{id}":
        "functions/molochv3/getProposals.handler",
      "GET /molochv3/activities/{network}/{id}":
        "functions/molochv3/getActivityLogs.handler",
      "GET /daostack/proposals/{network}/{id}":
        "functions/daostack/getProposals.handler",
      "GET /daostack/members/{network}/{id}":
        "functions/daostack/getMembers.handler",
      "GET /aave/proposals/{network}/{id}":
        "functions/aave/getProposals.handler",
      "GET /gnosis/members/{network}/{id}":
        "functions/gnosis/getMembers.handler",
      "GET /gnosis/proposals/{network}/{id}":
        "functions/gnosis/getProposals.handler",
      "GET /gnosis/activities/{network}/{id}":
        "functions/gnosis/getActivityLogs.handler",
      "GET /daodao/members/{network}/{id}":
        "functions/daodao/getMembers.handler",
      "GET /daodao/proposals/{network}/{id}":
        "functions/daodao/getProposals.handler",
      "GET /snapshot/members/{id}": "functions/snapshot/getMembers.handler",
      "GET /snapshot/delegations/{id}":
        "functions/snapshot/getDelegations.handler",
      "GET /snapshot/proposals/{id}": "functions/snapshot/getProposals.handler",
      "GET /nouns/members/{network}/{id}": "functions/nouns/getMembers.handler",
      "GET /boardroom/members/{network}/{id}":
        "functions/boardroom/getMembers.handler",
      "GET /boardroom/proposals/{network}/{id}":
        "functions/boardroom/getProposals.handler",
    },
    customDomain: {
      domainName: "services.daostar.org",
      hostedZone: "services.daostar.org",
      path: "api/v1",
    },
  });


  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
