(function($, ControllerJS, document, undefined) {
    var $codeLabel;
    var $log;
    var $arrow;
    var gameConnector;

    $(document).ready(function() {
        $log = $('textarea#log');
        $arrow = $('div#arrow');
        $codeLabel = $('#code-label');

        gameConnector = new ControllerJS.GameConnector()
        gameConnector.on(ControllerJS.Events.Types.CONNECTION.WAITING, function(e) {
            console.log(e)
            $codeLabel.text(e.connectCode);
            $log.val("... waiting for controller connect");
        });

        gameConnector.on(ControllerJS.Events.Types.CONNECTION.READY, function(e) {
            console.log(e)
            $log.val("Ready!");
        });

        gameConnector.on(ControllerJS.Events.Types.GAME.BUTTON.PRESS_DOWN, function(e) {
            console.log(e)
            $log.val($log.val() + '\n' + e.buttonCode);
        })

        gameConnector.on(ControllerJS.Events.Types.GAME.JOYSTICK.MOVE, function(e) {
            $arrow.css({
                transform: 'rotateZ(' + e.direction + 'rad)',
                fontSize: '' + (2 + (2 * e.magnitude)) + 'rem'
            })
        })

        gameConnector.on(ControllerJS.Events.Types.GAME.JOYSTICK.MOVE_START, function(e) {
            console.log(e)
            $log.val($log.val() + '\n' + e.joystickCode + ' - start');
        })

        gameConnector.on(ControllerJS.Events.Types.GAME.JOYSTICK.MOVE_END, function(e) {
            console.log(e)
            $arrow.css({
                transform: 'rotateZ(0deg)',
                fontSize: '2rem'
            })
            $log.val($log.val() + '\n' + e.joystickCode + ' - end');
        })

        gameConnector.init(window.location.origin.replace('http', 'ws') + '/game/init').then()
    });

})(jQuery, ControllerJS, document)