export default (function (aesop) {

    var babelSrc = [{
        expand: true,
        cwd: '<%= aesop.app %>',
        src: [
            '**/*.js',
            '!assets/**/*',
            '!vendor/**/*',
            '!compiled/**/*',
            '!config/preloaded-templates.js'
        ],
        dest: '<%= aesop.app %>/compiled',
    }];

    return {
        'dev': {
            options: {
                sourceMap: true,
            },
            files: babelSrc
        },
        'build': {
            options: {
                sourceMap: false,
            },
            files: babelSrc
        }

    };
})