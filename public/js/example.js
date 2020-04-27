(function($, ControllerJS, document, undefined) {
    var $codeLabel;
    var $log;
    var gameConnector;

    $(document).ready(function() {
        $log = $('textarea#log');
        $codeLabel = $('#code-label');

        gameConnector = new ControllerJS.GameConnector()
        gameConnector.on(ControllerJS.EVENTS.Types.CONNECTION.WAITING, function(e) {
            console.log(e)
            $codeLabel.text(e.connectCode);
            $log.val("... waiting for controller connect");
        });

        gameConnector.on(ControllerJS.EVENTS.Types.CONNECTION.READY, function(e) {
            console.log(e)
            $log.val("Ready!");
        });

        gameConnector.on(ControllerJS.EVENTS.Types.GAME.BUTTON.PRESS, function(e) {
            console.log(e)
            $log.val($log.val() + '\n' + e.buttonCode);
        })

        gameConnector.init(window.location.origin.replace('http', 'ws') + '/game/init').then()
    });

})(jQuery, ControllerJS, document)