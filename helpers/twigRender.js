const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);

const TwigRender = function(res, template, params) {
    params = params || {}
    res.send(twing.render(template + '.twig', {
        site: {
            static: '/static/'
        },
        ...params}))
}

module.exports = TwigRender