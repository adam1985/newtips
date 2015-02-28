require.config({
    "baseUrl": 'scripts',
    "paths": {
        "jquery": "jquery/jquery"
    },
    "shim": {
        "validform" : ["jquery"]
    }
});

require(['controller/initialize']);