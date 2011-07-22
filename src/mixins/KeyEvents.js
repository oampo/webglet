var KeyEvents = {};

KeyEvents.initKeyEvents = function() {
    document.onkeydown = this.preKeyPressed.bind(this);
    document.onkeyup = this.preKeyReleased.bind(this);
};

KeyEvents.preKeyPressed = function(event) {
    var code = event.which || event.keyCode;
    var key = KeyEvents.KEYS[code];
    var fKey = code - 111;
    if (fKey > 0 && fKey < 13) {
        key = 'f' + fKey;
    }
    if (!key) {
        key = String.fromCharCode(code).toLowerCase();
    }
    this.keyPressed(key);
};

KeyEvents.keyPressed = function(key) {
};

KeyEvents.preKeyReleased = function(event) {
    var code = event.which || event.keyCode;
    var key = KeyEvents.KEYS[code];
    if (!key) {
        key = String.fromCharCode(code).toLowerCase();
    }
    this.keyReleased(key);
};

KeyEvents.keyReleased = function(key) {
};

KeyEvents.KEYS = {
    13: 'enter',
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right',
    27: 'esc',
    32: 'space',
    8: 'backspace',
    9: 'tab',
    46: 'delete'
};
