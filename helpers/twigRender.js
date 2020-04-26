const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
const path = require('path')
let loader = new TwingLoaderFilesystem(path.join(__dirname, '..', 'views'));
let twing = new TwingEnvironment(loader);

const TwigRender = function(res, template, params) {
    params = params || {}
    twing.render(template + '.twig', {
        site: {
            static: '/public/'
        },
        ...params
    })
        .then(content => res.send(content))
        .catch(err => console.log(err))
}

module.exports = TwigRender