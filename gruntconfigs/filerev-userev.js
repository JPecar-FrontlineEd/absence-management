export default (function (aesop) {
	return {
		filerev: {
			build: {
				src: [
					'<%= aesop.build %>/js/*.js',
					'<%= aesop.build %>/css/*.css'
				]
			}
		}
	};
});