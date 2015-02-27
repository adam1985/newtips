require.config({
    "baseUrl": 'assets/scripts',
    "paths": {
        "jquery": "jquery/jquery"

    },
    "shim": {
        "validform" : ["jquery"]
    }
});

require(['controller/initialize']);