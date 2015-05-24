objects.titlescreen = function () {
    this.update = function () {
        canvas.draw_image("mainbg", 0, 0)
        canvas.draw_image("version", 0, 430)
        if (keypresses.enter) select_screen (1)
    }
}

objects.randomscreen = function () {
    this.update = function () {
        canvas.draw_image("keytest", 0, 0)
        if (keypresses.enter && keys.alt) select_screen (2)
    }
}

objects.bus = function () {
    this.x = 500
    this.y = 200
    this.speed = .5
    this.update = function () {
        if (keypresses.enter)
            this.speed += 1
        if (keypresses.alt)
            this.speed -= 1
        if (keys.left)
            this.x -= this.speed
        if (keys.right)
            this.x += this.speed
        if (keys.up)
            this.y += this.speed
        else if (this.y !== 200)
            this.y -= this.speed
        var v = this.x + this.y
        var seex = (this.x >= 0) ? this.x : 900 + this.x
        var seey = (this.y >= 0) ? this.y : 700 + this.y
        canvas.draw_image (Math.floor(v / 20) % 2 ? "bus1" : "bus2", seex % 900 - 400, seey % 700 - 180)
        canvas.draw_text ("x: " + this.x.toFixed(1) + " y: " + this.y.toFixed(1) + " seex: " + seex.toFixed(1) + " seey: " + seey.toFixed(1), 20, 470)
    }
}

objects.busbg = function () {
    this.update = function () {
        canvas.draw_image ("busbg", 0, 0)
    }
}
