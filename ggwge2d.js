/*
    ggwge2d.js - Main JavaScript code for ggwge2D
    Copyright 2015 GeckoGames
    
    This file is part of ggwge2D.
    
    ggwge2D is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ggwge2D is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with ggwge2D.  If not, see <http://www.gnu.org/licenses/>.
*/

var gameprops
var canvas = {}
var images = {}
var audio = {}
var gamedata = {
    screen: 0
}

/*
    canvas.draw_image:
    Draw an image on the screen, with x starting
    from the bottom of the canvas instead of the top.
*/
canvas.draw_image = function (image, x, y) {
    canvas.context.drawImage(images[image], x, canvas.h - y - images[image].height)
}

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

/*
    ggwge2d_preload_media:
    Preload media (audio + images) specified in gameprops
    by iterating through them. Calls callback when complete.
*/
var ggwge2d_preload_media = function (n, callback) {
    var gpil = gameprops.images.length;
    var gpal = gameprops.audio.length;
    /* If there are still images to preload: */
    if (n < gpil) {
        /* Load the image */
        images[gameprops.images[n]] = new Image()
        images[gameprops.images[n]].onload = function () { /* Make it re-call this function on load. */
            ggwge2d_preload_media (n + 1, callback)
        }
        images[gameprops.images[n]].src = gameprops.imagedir + "/" + gameprops.images[n] + gameprops.imageext /* Initialize loading. */
    } else if (n - gpil < gpal) {
        /* Load the audio */
        audio[gameprops.audio[n - gpil]] = new Audio()
        audio[gameprops.audio[n - gpil]].oncanplaythrough = function () { /* Make it re-call this function on load. */
            ggwge2d_preload_media (n + 1, callback)
        }
        /* Initialize Loading */
        audio[gameprops.audio[n - gpil]].src = gameprops.audiodir + "/" + gameprops.audio[n - gpil] + gameprops.audioext
    } else {
    /* If done, run the callback. */
        callback ()
    }
}

/*
    ggwge2d_update_game:
    This is the main game loop.
*/
var ggwge2d_update_game = function () {
    /* Clear the canvas. */
    canvas.context.clearRect(0, 0, canvas.w, canvas.h)


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

        /*
            Preload all the media, then run further
            initialization when complete.
        */
        ggwge2d_preload_media (0, function () {
            /* Game loop */
            setInterval (ggwge2d_update_game, 1000 / gameprops.fps)
        })
    })
}
