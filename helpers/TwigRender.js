const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
const path = require('path')
const auth = require('../auth.json')
let loader = new TwingLoaderFilesystem(path.join(__dirname, '..', 'views'));
let twing = new TwingEnvironment(loader);

const TwigRender = function(res, template, params) {
    if (auth.debug) {
        twing = new TwingEnvironment(loader);
    }

    params = params || {}
    twing.render(template + '.twig', {
        site: {
            static_dir: auth.static.resource + '/'
        },
        ...params
    })
        .then(content => res.send(content))
        .catch(err => console.log(err))
}

module.exports = TwigRender