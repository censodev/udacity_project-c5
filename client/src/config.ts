// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'zm27y2nm9g'
export const apiEndpoint = `https://${apiId}.execute-api.ap-southeast-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-ki4eqgfx.us.auth0.com',            // Auth0 domain
  clientId: 'KUKkLBmWRVmbWDZmJAzIzFhZ1hvrXXMm',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
