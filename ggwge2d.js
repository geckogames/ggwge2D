var gameprops
var canvas = {}

/*
    ggwhe2d_load_file:
    Load a file (file_to_load) using XMLHttpRequests, then
    run the callback function (callback), passing the file
    contents as the first argument.
*/
var ggwge2d_load_file = function (file_to_load, callback) {
    
    /*
        docallback:
        Calls the passed callback function (callback), passing
        the XMLHttpRequest file contents as the first argument.
    */
    var docallback = function () {
        /*
            Call the callback. this.responseText contains the
            file contents to pass.
        */
        callback (this.responseText)
    }
    
    var request = new XMLHttpRequest()
    request.onload = docallback /* Set the callback for the request to docallback. */
    request.open("get", file_to_load, true)
    request.send() /* Initiate request. */
}

/*
    ggwge2d_initialize_canvas:
    Initialize the canvas by setting values in the
    canvas object.
*/
var ggwge2d_initialize_canvas = function () {
    canvas.element = document.querySelector (gameprops.canvas)
    canvas.context = canvas.element.getContext("2d")
    canvas.w = canvas.element.width
    canvas.h = canvas.element.height
}

window.onload = function () {
    /*
        Load the game props file (game.json) into gameprops
        and then run further initialization when complete.
    */
    ggwge2d_load_file ("game.json", function (text) {
        
        /* Parse the gameprops JSON and put it into gameprops. */
        gameprops = JSON.parse(text)
        
        /* Initialization Functions */
        ggwge2d_initialize_canvas()
    })
}