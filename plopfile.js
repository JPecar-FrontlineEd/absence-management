module.exports = function (plop) {
	'use strict';

	plop.addHelper('carrots', function (text) {
		return (new Array(text.length)).join('^');
	});

	plop.addHelper('dashes', function (text) {
		return (new Array(text.length)).join('-');
	});

	plop.addHelper('ng', function (text) {
		return '{{ ' + text + ' }}';
	});



	//------------------Controller-------------------------------
	plop.setGenerator('controller', {
		description: 'Re-usable code controller',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'Controller name is required',
			validate: function(value){
				if (value.length > 0) {
					return true;
				}
				return 'Controller name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/global/controllers/{{camelCase name}}Ctrl.js',
			templateFile: 'templates/controller.js'
		}]
	});

	// {
	// 	type: 'add',
	// 	path: 'app/global/controllers/{{camelCase name}}Ctrl.spec.js',
	// 	templateFile: 'templates/controller-spec.js'
	// }
	//------------------Controller-------------------------------



	//------------------Route-------------------------------
	plop.setGenerator('route', {
		description: 'page route',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'Route name is required',
			validate: function(value){
				if (value.length > 0) {
					return true;
				}
				return 'Route name is required';
			}
		},{
			type: 'input',
			name: 'path',
			message: 'Route Path is required',
			validate: function(value){
				if (value.length > 0) {
					return true;
				}
				return 'Route path is required';
			}
		},{
			type: 'input',
			name: 'needFlexibleWidth',
			message: 'Need flexible width applied to this Route (Y/N) ?',
			validate: function(value){
				if((/y|Y|n|N/).test(value)) { return true; }
				return 'Invalid response';
			}
		},{
			type: 'input',
			name: 'isNestedRoute',
			message: 'Is this a nested or sub Route (Y/N) ?',
			validate: function(value){
				if((/y|Y|n|N/).test(value)) { return true; }
				return 'Invalid response';
			}
		}],
		actions: function (data){
			var needFlexibleWidth = data.needFlexibleWidth.toLowerCase() === 'y';
			var isNestedRoute = data.isNestedRoute.toLowerCase() === 'y';
			var cssClass = '';
			if(!isNestedRoute) {
				cssClass = needFlexibleWidth ? 'flexible-width' : 'fixed-width';
			}
			var actions = [{
		   type: 'add',
		   path: 'app/routes/{{lowerCase path}}/{{dashCase name}}.html',
		   template: '<div class="'+ cssClass +' route-{{dashCase path}}-{{dashCase name}}" ng-controller="{{properCase name}}Ctrl as route">\r\n\r\n</div>'
		  },{
		   type: 'add',
		   path: 'app/routes/{{lowerCase path}}/{{dashCase name}}.styl',
		   template: '.route-{{dashCase path}}-{{dashCase name}} {\r\n\t\r\n}'
		  },{
		   type: 'add',
		   path: 'app/global/controllers/route-{{camelCase name}}Ctrl.js',
		   templateFile: 'templates/route-controller.js'
		 }];

			return actions;
		}
	});

	// {
	// 	type: 'add',
	// 	path: 'app/global/controllers/route-{{camelCase name}}Ctrl.spec.js',
	// 	templateFile: 'templates/route-controller-spec.js'
	// }
	//------------------Route-------------------------------




	//------------------Directive-------------------------------
	plop.setGenerator('directive', {
		description: 'Re-usable piece of DOM functionality',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'Directive name is required',
			validate: function(value){
				if (value.length > 0) {
					return true;
				}
				return 'Directive name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/global/directives/ap-{{dashCase name}}.js',
			templateFile: 'templates/directive.js'
		}]
	});

	// {
	// 	type: 'add',
	// 	path: 'app/global/directives/ap-{{dashCase name}}.spec.js',
	// 	templateFile: 'templates/directive-spec.js'
	// }
	//------------------Directive-------------------------------



	//------------------Filter-------------------------------
	plop.setGenerator('filter', {
		description: 'Angular style filter',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'filter name is required',
			validate: function(value){
				if (value.length > 0) {
					return true;
				}
				return 'Filter name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/global/filters/{{camelCase name}}Filter.js',
			templateFile: 'templates/filter.js'
		}]
	});

	// {
	// 	type: 'add',
	// 	path: 'app/global/filters/{{camelCase name}}Filter.spec.js',
	// 	templateFile: 'templates/filter-spec.js'
	// }
	//------------------Filter-------------------------------



	//------------------Service-------------------------------
	plop.setGenerator('service', {
		description: 'Re-usable and injectble piece of logic or state',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'Service name is required',
			validate: function(value){
				if (value.length > 0) {
					return true;
				}
				return 'Service name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/global/services/{{camelCase name}}Svc.js',
			templateFile: 'templates/service.js'
		},{
			type: 'add',
			path: 'app/global/services/{{camelCase name}}Svc.spec.js',
			templateFile: 'templates/service-spec.js'
		}]
	});
	//------------------Service-------------------------------

	//------------------Value-------------------------------
	plop.setGenerator('value', {
		description: 'Injectable value',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'Value name is required',
			validate: function(value){
				if (value.length > 0) {
					return true;
				}
				return 'Value name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/global/values/{{camelCase name}}Val.js',
			templateFile: 'templates/value.js'
		}]
	});
	//------------------Value-------------------------------

	//------------------API-------------------------------
	plop.setGenerator('api', {
		description: 'Logic to handle comunication with an endpoint',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'Endpoint name is required',
			validate: function(value) {
				if (value.length > 0) {
					return true;
				}
				return 'API endpoint name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/global/endpoints/{{camelCase name}}Api.js',
			templateFile: 'templates/endpoint.js'
		}]
	});
	//------------------API-------------------------------


	//------------------Helper-------------------------------
	plop.setGenerator('helper', {
		description: 'Code to manage logic to a specific helper',
		prompts:[{
			type: 'input',
			name: 'name',
			message: 'Helper name is required',
			validate: function(value) {
				if (value.length > 0) {
					return true;
				}
				return 'Helper name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/global/helpers/{{camelCase name}}Help.js',
			templateFile: 'templates/helper.js'
		},{
			type: 'add',
			path: 'app/global/helpers/{{camelCase name}}Help.spec.js',
			templateFile: 'templates/helper-spec.js'
		}]
	});
	//------------------Helper-------------------------------


	//------------------Component-------------------------------
	plop.setGenerator('component', {
		description: 'A small re-usable part of a web page.',
		prompts:[{
			type: 'input',
			name: 'namespace',
			message: 'component namespace is required',
			validate: function(value) {
				if (value.length > 0) {
					return true;
				}
				return 'Component namespace is required';
			}
		},{
			type: 'input',
			name: 'name',
			message: 'component name is required',
			validate: function(value) {
				if (value.length > 0) {
					return true;
				}
				return 'Component name is required';
			}
		}],
		actions: [{
			type: 'add',
			path: 'app/components/{{dashCase namespace}}/cmpt-{{dashCase namespace}}-{{dashCase name}}/{{camelCase namespace}}{{properCase name}}.html',
			templateFile: 'templates/partial.html'
		},{
			type: 'add',
			path: 'app/components/{{dashCase namespace}}/cmpt-{{dashCase namespace}}-{{dashCase name}}/{{camelCase namespace}}{{properCase name}}.styl',
			template: '.cmpt-{{dashCase namespace}}-{{dashCase name}} {\r\n\t\r\n}'
		},{
			type: 'add',
			path: 'app/components/{{dashCase namespace}}/cmpt-{{dashCase namespace}}-{{dashCase name}}/{{camelCase namespace}}{{properCase name}}.js',
			templateFile: 'templates/component-directive.js'
		}]
	});

	// {
	// 	type: 'add',
	// 	path: 'app/components/{{dashCase namespace}}/cmpt-{{dashCase namespace}}-{{dashCase name}}/{{camelCase namespace}}{{properCase name}}.spec.js',
	// 	templateFile: 'templates/component-spec.js'
	// }
	//------------------Component-------------------------------


};
