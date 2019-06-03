var Krunker = function() {
    this.past = this.maps = this.game = this.inputs = this.camera = this.mapInfo = null;
    this.isSliding = !1;
    this.weapons = {
        Revolver: {
            c: [ 2.3317, -.0255, 1.686, -.0195, 1.8068 ],
            d: 25
        },
        "Assault Rifle": {
            c: [ 3.8279, -.0636, 1.5821, -.009, .6986 ],
            d: 10
        },
        Pistol: {
            c: [ 4.2009, -.0385, 2.447, -.0126, -.5214 ],
            d: 25
        },
        "Sniper Rifle": {
            c: [ 35.564, -.0094, 1.1617, 0, -1 ],
            d: !1
        }
    };
    this.settings = {
        bhop: 0,
        bhopHeld: !1,
        autoReload: !1,
        autoAim: 0,
        crosshair: 0,
        aimPosition: 3,
        autoAimRange: "Default",
        slide: !1,
        esp: !1
    };
    this.settingsMenu = [];
    this.createMenu();
};

Krunker.prototype.loop = function(a, b, c, d) {
    this.me = b;
    this.camera = a;
    this.game = d;
    this.inputs = c;
    this.bhop();
    this.autoReload();
    this.aimbot();
};

Krunker.prototype.createMenu = function() {
    document.getElementById("menuItemContainer").insertAdjacentHTML("beforeend", '<div style="color:orange;" class=\'menuItem\' onmouseover="playTick()" onclick="showWindow(window.windows.length);">Scripts</a>');
    var a = this;
    this.settingsMenu = {
        bhop: {
            name: "BHop",
            pre: "<div class='setHed'>Movement</div>",
            val: 0,
            html: function() {
                return '<select  onchange="window.Krunker.setSetting(\'bhop\', this.value)"><option value="0"' + (0 == a.settingsMenu.bhop.val ? " selected" : "") + '>Disabled</option><option value="1"' + (1 == a.settingsMenu.bhop.val ? " selected" : "") + '>Automatic</option><option value="2"' + (2 == a.settingsMenu.bhop.val ? " selected" : "") + ">Manual</option></select>";
            },
            set: function(b) {
                a.settings.bhop = parseInt(b);
            }
        },
        slide: {
            name: "Slide Jump",
            val: 0,
            html: function() {
                return "<label class='switch'><input type='checkbox'  onclick='window.Krunker.setSetting(\"slide\", this.checked)' " + (a.settingsMenu.slide.val ? "checked" : "") + "><span class='slider'></span></label>";
            },
            set: function(b) {
                a.settings.slide = b;
            }
        },
        esp: {
            name: "ESP",
            pre: "<div class='setHed'>ESP</div>",
            val: 0,
            html: function() {
                return "<label class='switch'><input type='checkbox'  onclick='window.Krunker.setSetting(\"esp\", this.checked)' " + (a.settingsMenu.esp.val ? "checked" : "") + "><span class='slider'></span></label>";
            },
            set: function(b) {
                a.settings.esp = b;
            }
        },
        autoReload: {
            name: "Auto Reload",
            pre: "<div class='setHed'>Combat</div>",
            val: 0,
            html: function() {
                return "<label class='switch'><input type='checkbox'  onclick='window.Krunker.setSetting(\"autoReload\", this.checked)' " + (a.settingsMenu.autoReload.val ? "checked" : "") + "><span class='slider'></span></label>";
            },
            set: function(b) {
                a.settings.autoReload = b;
            }
        },
        autoAim: {
            name: "Auto Aim",
            val: 3,
            html: function() {
                return '<select  onchange="window.Krunker.setSetting(\'autoAim\', this.value)">\n                    <option value="0"' + (0 == a.settingsMenu.autoAim.val ? " selected" : "") + '>Disabled</option>\n                    <option value="1"' + (1 == a.settingsMenu.autoAim.val ? " selected" : "") + '>Quickscoper</option>\n                    <option value="2"' + (2 == a.settingsMenu.autoAim.val ? " selected" : "") + '>Manual</option>\n                    <option value="3"' + (3 == a.settingsMenu.autoAim.val ? " selected" : "") + ">Hip Fire</option>\n                   </select>";
            },
            set: function(b) {
                a.settings.autoAim = parseInt(b);
            }
        },
        aimPosition: {
            name: "Aim Position",
            val: 0,
            html: function() {
                return '<select  onchange="window.Krunker.setSetting(\'aimPosition\', this.value)">\n                    <option value="1"' + (1 == a.settingsMenu.aimPosition.val ? " selected" : "") + '>HEAD</option>\n                    <option value="2"' + (2 == a.settingsMenu.aimPosition.val ? " selected" : "") + '>NECK</option>\n                    <option value="3"' + (3 == a.settingsMenu.aimPosition.val ? " selected" : "") + ">BODY</option>\n                    </select>";
            },
            set: function(b) {
                a.settings.aimPosition = parseInt(b);
            }
        },
        autoAimRange: {
            name: "Auto Aim Range",
            val: "Default",
            html: function() {
                var b = "<select  onchange=\"window.Krunker.setSetting('autoAimRange', this.value)\">", c = a.getAimRange("all"), d;
                for (d in c) b += '<option value="' + d + '"' + (a.settingsMenu.autoAimRange.val == d ? " selected" : "") + ">" + (0 == d ? c[d] : c[d] / 10 + "m") + "</option>";
                return b + "</select>";
            },
            set: function(b) {
                a.settings.autoAimRange = parseInt(b);
            }
        }
    };
};

Krunker.prototype.setupSettings = function() {
    for (var a in this.settingsMenu) if (this.settingsMenu[a].set) {
        var b = this.getSavedVal("krunkerio_io" + a);
        this.settingsMenu[a].val = null !== b ? b : this.settingsMenu[a].val;
        "false" === this.settingsMenu[a].val && (this.settingsMenu[a].val = !1);
        this.settingsMenu[a].set(this.settingsMenu[a].val, !0);
    }
};

Krunker.prototype.getAimRange = function(a) {
    var b = "Default 100 150 200 250 300 350 400 450 500 750 1000".split(" ");
    return "all" == a ? b : b[a];
};

Krunker.prototype.setSetting = function(a, b) {
    document.getElementById("krunker_io" + a) && (document.getElementById("krunker_io" + a).innerHTML = b);
    this.settingsMenu[a].set(b);
    this.settingsMenu[a].val = b;
    this.saveVal("krunkerio_io" + a, b);
};

Krunker.prototype.keyDown = function(a) {
    if ("INPUT" !== document.activeElement.tagName) switch (a.key.toUpperCase()) {
      case " ":
        if (2 !== this.settings.bhop) break;
        this.settings.bhopHeld = !0;
        break;

      case "T":
        this.settings.autoAim++;
        3 < this.settings.autoAim && (this.settings.autoAim = 0);
        this.setSetting("autoAim", this.settings.autoAim);
        a = 0 === this.settings.autoAim ? "Disabled" : 3 === this.settings.autoAim ? "Hip Fire" : 2 === this.settings.autoAim ? "Manual" : "Quickscoper";
        this.chatMessage(null, "<span style='color:#fff'>AutoAim - </span> <span style='color:" + (0 < this.settings.autoAim ? "green" : "red") + "'>" + a + "</span>", !0);
        break;

      case "B":
        this.settings.bhop++;
        2 < this.settings.bhop && (this.settings.bhop = 0);
        this.setSetting("bhop", this.settings.bhop);
        a = 0 === this.settings.bhop ? "Disabled" : 2 === this.settings.bhop ? "Manual" : "Automatic";
        this.chatMessage(null, "<span style='color:#fff'>BHop - </span> <span style='color:" + (0 < this.settings.bhop ? "green" : "red") + "'>" + a + "</span>", !0);
        break;

      case "Y":
        this.settings.autoAimRange++;
        11 < this.settings.autoAimRange && (this.settings.autoAimRange = 0);
        this.setSetting("autoAimRange", this.settings.autoAimRange);
        a = 0 == this.settings.autoAimRange ? this.getAimRange(this.settings.autoAimRange) : this.getAimRange(this.settings.autoAimRange) / 10 + "m";
        this.chatMessage(null, "<span style='color:#fff'>AimRange - </span> <span style='color:" + (0 < this.settings.autoAimRange ? "green" : "red") + "'>" + a + "</span>", !0);
        break;

      case "U":
        this.settings.esp = this.settings.esp ? !1 : !0, this.setSetting("esp", this.settings.esp), 
        a = this.settings.esp ? "Enabled" : "Disabled", this.chatMessage(null, "<span style='color:#fff'>ESP - </span> <span style='color:" + (this.settings.esp ? "green" : "red") + "'>" + a + "</span>", !0);
    }
};

Krunker.prototype.chatMessage = function(a, b, c) {
    0 == $("#haxMsg").length && $("<div>", {
        id: "haxMsg",
        css: {
            "z-index": 999,
            position: "absolute",
            width: "100%",
            "text-align": "center",
            bottom: "10px",
            "font-size": "20px",
            "text-shadow": "0.5px 0.5px #000, 0.5px -0.5px #000, -0.5px 0.5px #000, -0.5px -0.5px #000"
        }
    }).appendTo("body");
    $("#haxMsg").html(b);
    $("#haxMsg").stop(!0, !0).show().fadeOut(3e3);
};

Krunker.prototype.keyUp = function(a) {
    "INPUT" !== document.activeElement.tagName && 32 === a.keyCode && (2 !== this.settings.bhop ? void 0 : this.settings.bhopHeld = !1);
};

Krunker.prototype.saveVal = function(a, b) {
    "undefined" != typeof Storage && localStorage.setItem(a, b);
};

Krunker.prototype.getSavedVal = function(a) {
    return "undefined" != typeof Storage ? localStorage.getItem(a) : null;
};

Krunker.prototype.bhop = function() {
    var a = this;
    if (0 !== this.settings.bhop) {
        if (1 === this.settings.bhop && this.camera.keys && null !== this.camera.moveDir || 2 === this.settings.bhop && this.settings.bhopHeld) this.camera.keys[this.camera.jumpKey] = !this.camera.keys[this.camera.jumpKey];
        this.settings.slide && this.settings.bhopHeld && (this.isSliding ? this.inputs[8] = 1 : -.04 > this.me.yVel && this.me.canSlide && (this.isSliding = !0, 
        setTimeout(function() {
            a.isSliding = !1;
        }, 100), this.inputs[8] = 1));
    }
};

Krunker.prototype.autoReload = function() {
    this.settings.autoReload && this.me.weapon.ammo && 0 === this.me.ammos[this.me.weaponIndex] && 0 === this.inputs[9] && (this.inputs[9] = 1);
};

Krunker.prototype.getRange = function() {
    return 0 < this.settings.autoAimRange ? parseInt(this.getAimRange(this.settings.autoAimRange)) : this.me.weapon.range ? this.me.weapon.range : 9999;
};

Krunker.prototype.getDist = function(a, b) {
    var c = a.x - b.x, d = a.y - b.y;
    a = a.z - b.z;
    return Math.sqrt(c * c + d * d + a * a);
};

Krunker.prototype.autoShot = function(a) {
    if (a && 0 !== this.settings.autoAim) if (2 === this.settings.autoAim && 1 === this.me.aimVal || 3 === this.settings.autoAim && 0 === this.me.aimVal || this.getDist(this.me, a) > this.getRange()) window.control.aimTarget = null, 
    window.control.target = null; else if (0 === this.me.ammos[this.me.weaponIndex]) this.aimReset(); else switch (window.control.camLookAt(a.x, a.y + a.height + this.aimCompensator(a), a.z), 
    this.settings.autoAim) {
      case 1:
        this.past && new Date().getTime() - this.past <= this.aimDelay() ? this.aimReset() : (window.control.mouseDownR = 1, 
        .3 >= this.me.aimVal && (window.control.mouseDownL = 1, this.past = new Date().getTime()));
    } else this.aimReset();
};

Krunker.prototype.aimReset = function() {
    window.control.camLookAt(null);
    window.control.aimTarget = null;
    window.control.target = null;
    1 === this.settings.autoAim && (window.control.mouseDownR = 0, window.control.mouseDownL = 0);
};

Krunker.prototype.aimDelay = function() {
    var a = this.weapons[this.me.weapon.name];
    return a && a.d ? a.d : this.me.weapon.rate - 50;
};

Krunker.prototype.aimCompensator = function(a) {
    var b = this.getDist(this.me, a), c = .01 > this.me.recoilAnimY ? .01 : this.me.recoilAnimY, d = 700 <= b ? 700 : b, e = this.weapons[this.me.weapon.name], f = -this.settings.aimPosition;
    return !e || .01 == c || 20 > b ? f - 2.5 * a.crouchVal - 7.5 * this.me.recoilAnimY : f + e.c[0] * (c - .01) * (e.c[1] * d + e.c[2]) + (e.c[3] * d + e.c[4]);
};

Krunker.prototype.aimbot = function() {
    var a = this, b = !1, c = window.targets;
    try {
        var d = c.filter(function(a) {
            return a.inView;
        }).filter(function(a) {
            return !a.isYou;
        }).filter(function(b) {
            return !b.team || b.team !== a.me.team;
        }).filter(function(a) {
            return a.active;
        });
        d = d.sort(function(b, c) {
            return a.getDist(a.me, b) - a.getDist(a.me, c);
        });
        b = d[0];
        this.autoShot(b);
    } catch (e) {
        this.aimReset();
    }
};

Krunker.prototype.roundN = function(a, b) {
    return parseFloat(Math.round(a * Math.pow(10, b)) / Math.pow(10, b)).toFixed(b);
};

window.Krunker = new Krunker();
