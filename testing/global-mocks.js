var siteConfig = window.siteConfig = {
	idm: {
		enabled: 'off',
		identityGatewayBaseUri: 'https://idgatewayawsstage.flqa.net/',
    	clientId: 'mocked',
    	productId: 'mocked',
    	baseUri: 'http://localhost.fldev.net:3000/access',
			clockSkewSeconds: 3600,

	}
}

beforeEach(module('aesop'));
