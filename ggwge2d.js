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
    screen:0,
    ticks: 0
}
var screen
var objects = {}
var keys = {}
var keypresses = {}

/*
    canvas.draw_image:
    Draw an image on the screen, with x starting
    from the bottom of the canvas instead of the top.
*/
canvas.draw_image = function (image, x, y) {
    canvas.context.drawImage(images[image], x, canvas.h - y - images[image].height)
}

var select_screen = function (screenid) {
    gamedata.screen = screenid
    screen = {}
    screen.layers = []
    for (var i = 0; i < gameprops.screens[screenid].layers.length; i++) {
        screen.layers[i] = []
        for (var j = 0; j < gameprops.screens[screenid].layers[i].length; j++) {
            screen.layers[i][j] = new objects[gameprops.screens[screenid].layers[i][j]]()
        }
    }
    for (var prop in gameprops.screens[screenid])
    {
        if (prop !== "layers")
            screen[prop] = gameprops.screens[screenid][prop]
    }
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
        callback()
    }
}

/*
    ggwge2d_preload_scripts:
    Preloads scripts specified in gameprops by
    iterating through them. Calls callback when complete.
*/
var ggwge2d_preload_scripts = function (n, callback) {
    /* If there are still scripts to preload: */
    if (n < gameprops.scripts.length) {
        /* Load a script */
        var scr = document.createElement("script")
        scr.onload = function () {
            ggwge2d_preload_scripts (n + 1, callback)
        }
        scr.src = gameprops.scripts[n];
        document.body.appendChild (scr)
    } else {
        /* If done, run callback. */
        callback()
    }
}

/*
    ggwge2d_object_indexof:
    Get the named index of a value in an object.
*/
var ggwge2d_object_indexof = function (obj, content) {
    for (var x in obj)
        if (obj[x] === content)
            return x
    return -1;
}

/*
    ggwge2d_update_game:
    This is the main game loop.
*/
var ggwge2d_update_game = function () {
    /* Clear the canvas. */
    canvas.context.clearRect(0, 0, canvas.w, canvas.h)

    /* Add 1 tick. */
    gamedata.ticks++

    /* Loop through layers in screen. */
    for (var i = 0; i < screen.layers.length; i++) {
        /* Loop through objects in layer. */
        for (var j = 0; j < screen.layers[i].length; j++) {
            /* Update this screen. */
            screen.layers[i][j].update()
        }
    }

    /* Clear key-presses. */
    keypresses = {}
}

window.onkeydown = function (e) {
    /* Check if this key is bound to something. */
    var prop = ggwge2d_object_indexof(gameprops.keys, e.keyCode)
    if (prop !== -1) {
        /* If it is... */

        /* If this isn't a repeat press, set the keypress. */
        if (!keys[prop])
            keypresses[prop] = true

        /* Set the key. */
        keys[prop] = true

        /* Because this is bound, prevent the browser from reacting. */
        e.preventDefault()
        e.stopPropagation()
    }
}

window.onkeyup = function (e) {
    /* Check if this key is bound to something. */
    var prop = ggwge2d_object_indexof(gameprops.keys, e.keyCode)
    if (prop !== -1) {
        /* If it is... */

        /* Set the key. */
        keys[prop] = false

        /* Because this is bound, prevent the browser from reacting. */
        e.preventDefault()
        e.stopPropagation()
    }
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
            /*
                Preload all the scripts, then run firther
                initialization when complete.
            */
            ggwge2d_preload_scripts (0, function () {
                /* Choose first screen. */
                select_screen (0)

                /* Game loop */
                setInterval (ggwge2d_update_game, 1000 / gameprops.fps)
            })
        })
    })
}
