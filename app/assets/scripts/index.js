require.config({
    "baseUrl": '/assets/scripts',
    "paths": {
        "jquery": "jquery/jquery",
        "validform" : "component/Validform_v5.3.2",
        "pageinator" : "component/bootstrap-paginator"

    },
    "shim": {
        "validform" : ["jquery"]
    }
});

require(['controller/initialize']);