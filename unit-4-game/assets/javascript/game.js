function Character(id, hp, ap, dp) {
    this.id = id;
    this.hp = hp;
    this.ap = ap;
    this.dp = dp;
    this.attacks = 0;
    this.damage = 0;
}

Character.prototype.getAttackPower = function () { return this.ap * (1 + this.attacks); }
Character.prototype.getHitPoints = function () { return this.hp - this.damage; }
Character.prototype.getCounterAttackPower = function () { return this.dp; }
Character.prototype.refresh = function() {
    document.getElementById(this.id).innerText = "HP: " + this.getHitPoints() + "AP: " + this.getAttackPower() + " CAP: " + this.getCounterAttackPower();
};
