## How to Run and Debug an Aesop-FrontEnd Cypress Test
- Add Host File Entry (located at C:\Windows\System32\drivers\etc\hosts)
	- 127.0.0.1 localhost.fldev.net
- Install Nodejs
	- install latest from https://nodejs.org/en
- Install App
	- run commands from https://github.com/FrontlineEducation/Aesop-FrontEnd
		- `npm install -g grunt-cli plop stylus karma`
		- cd myProjectFolderPath
		- `npm install`
		- `npm install -g karma-jasmine karma-chrome-launcher karma-ng-html2js-preprocessor karma-notify-reporter`
- Run App
	- run command: `grunt dev`
- Run Cypress
	- run command: `cypress_open_ui.bat`
- Debug Cypress
	- enter keyword `debugger` in a test
	- run cypress with the dev tools open. Cypress will stop at the debugger line
	
	
