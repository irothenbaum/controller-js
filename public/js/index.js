(function($, window, undefined) {
    $(document).ready(function() {
        $('#go-button').click(function() {
            window.location.href = '/play/' + $('#game-code').val()
        })
    })
})(jQuery, window)