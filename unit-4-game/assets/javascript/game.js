var STATE = {
    SELECT_HERO: 1,
    PICK_ENEMY: 2,
    FIGHT_ENEMY: 3,
    WIN: 4,
    LOSS: 5,
}

function Game(characters) {
    this.characters = characters;
    this.state = STATE.SELECT_HERO;

    for (var i = 0; i < characters.length; i++) {
        var c = characters[i];
        document.getElementById(c.getId()).onclick = (function(self, ch) {
            return function(event) {
                self.characterClickHandler(ch);
            }    
        })(this, c);
    }    
    document.getElementById("attack").onclick = (function(self) {
        return function(event) {
            self.attack();
        }    
    })(this);
};

Game.prototype.characterClickHandler = function(character) {
    switch(this.state) {
        case STATE.SELECT_HERO:
            this.hero = character;
            this.enemies = this.characters.filter(c => c != character);
            this.state = STATE.PICK_ENEMY;
            break;
        case STATE.PICK_ENEMY:
            if (this.enemies.findIndex(c => c == character) != -1) {
                this.enemy = character;
                this.enemies = this.enemies.filter(c => c != character);
                this.state = STATE.FIGHT_ENEMY;
            }
            break;
   }
   this.refresh();
};

Game.prototype.attack = function() {
    if (this.state == STATE.FIGHT_ENEMY) {
        var attackDamage = this.hero.attack(this.enemy);
        var counterAttackDamage = this.enemy.counterAttack(this.hero);
        document.getElementById("attack_report").innerText = this.hero + " attacked " + this.enemy + " for " + attackDamage + " damage";
        document.getElementById("counter_attack_report").innerText = this.enemy + " counterattacked " + this.hero + " for " + counterAttackDamage + " damage";

        if (this.hero.isDead()) {
            this.state = STATE.LOSS;
        }
        if (this.enemy.isDead()) {
            this.enemy = undefined;
            if (this.enemies.length > 0) {
                this.state = STATE.PICK_ENEMY;
            } else {
                this.state = STATE.WIN;
            }    
        }
        this.refresh();
    }
}

Game.prototype.refresh = function() {
    for (var i = 0; i < this.characters.length; i++) {
        this.characters[i].refresh();
    }
    if (this.hero) {
        console.log("Hero: " + this.hero);
    }
    if (this.enemy) {
        console.log("Current enemy: " + this.enemy);
    }

    if (this.enemies) {
        console.log("Remainig enemies: " + this.enemies);
    }
    console.log("state:" + this.state);
};

function Character(id, hp, ap, dp) {
    this.id = id;
    this.hp = hp;
    this.ap = ap;
    this.dp = dp;
    this.attacks = 0;
    this.damage = 0;
};

Character.prototype.getId = function() { return this.id; }
Character.prototype.getHitPoints = function() { return this.hp - this.damage; }
Character.prototype.isDead = function() { return this.hp <= this.damage; }
Character.prototype.getAttackPower = function() { return this.ap * (1 + this.attacks); }
Character.prototype.getCounterAttackPower = function() { return this.dp; }
Character.prototype.refresh = function() {
    document.getElementById(this.id + ".state").innerText = "HP: " + this.getHitPoints() + " AP: " + this.getAttackPower() + " CAP: " + this.getCounterAttackPower();
};
Character.prototype.toString = function() {
    return this.id;
}
Character.prototype.attack = function(that) {
    var damage = this.getAttackPower();
    this.attacks += 1;
    that.damage += damage;
    return damage;
}
Character.prototype.counterAttack = function(that) {
    var damage = this.getCounterAttackPower();
    that.damage += damage;
    return damage;
}

function startGame () {
    var c1 = new Character("obiwanKenobi", 100, 1, 5);
    var c2 = new Character("lukeSkywalker", 50, 5, 1);
    var c3 = new Character("darthSidius", 30, 10, 0);
    var c4 = new Character("darthVader", 75, 8, 2);
    var game = new Game([c1, c2, c3, c4]);
    game.refresh();
};
