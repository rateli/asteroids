import Entity from './entity';
import Bullet from './bullet';
import Vector2D from '../utils/vector2d';
import { Key, KEY_STATE } from '../controls';
import Sprite from '../utils/sprite';

const SPRITE_SOURCE = '../assets/ship.png';
const SPRITE_FRAMES = 2;
const FRAME_HEIGHT = 33;
const FRAME_WIDTH = 33;

export default class Ship extends Entity {
    public bullets: Bullet[];
    private acceleration: Vector2D;
    private thrust: number = 0;
    private reloadTimer: number = 0;
    private readonly sprite: Sprite;

    constructor(x: number, y: number) {
        super({x, y}, 16, {x: 0, y: 0}, 0);
        this.acceleration = {x: 0, y: 0};
        this.bullets = [new Bullet(this), new Bullet(this), new Bullet(this), new Bullet(this)];
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if(this.thrust > 0) {
            this.sprite.setFrame(1);
        } else {
            this.sprite.setFrame(0);
        }
        this.sprite.setRotation(this.direction);
        this.sprite.render(ctx, this.x, this.y);

        this.drawDebugHelpers(ctx);
    }

    public update(delta: number): void {
        if (KEY_STATE.has(Key.Left)) this.rotateLeft();
        if (KEY_STATE.has(Key.Right)) this.rotateRight();
        if (KEY_STATE.has(Key.Shoot)) this.fire();
        if (KEY_STATE.has(Key.Throttle)) {
            this.thrust = 7;
        } else {
            this.thrust = 0;
        }

        this.acceleration.x += Math.cos(this.direction) * this.thrust * delta;
        this.acceleration.y += Math.sin(this.direction) * this.thrust * delta;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        // apply friction
        this.velocity.x *= 0.99;
        this.velocity.y *= 0.99;
        if(this.thrust === 0) {
            if (this.velocity.x < delta && this.velocity.x > -delta) this.velocity.x = 0;
            if (this.velocity.y < delta && this.velocity.y > -delta) this.velocity.y = 0;
        }

        // apply maxvelocity  limit
        const maxVel = 500 * delta;
        if (this.velocity.x > maxVel) this.velocity.x = maxVel;
        if (this.velocity.y > maxVel) this.velocity.y = maxVel;
        if (this.velocity.x < -maxVel) this.velocity.x = -maxVel;
        if (this.velocity.y < -maxVel) this.velocity.y = -maxVel;

        this.handleAreaBoundsCheck();
    }

    public rotateLeft(): void {
        this.direction = (this.direction - 0.07)
    }

    public rotateRight(): void {
        this.direction = (this.direction + 0.07)
    }

    public fire(): void {
        if (this.reloadTimer > 0) {
            this.reloadTimer -= 1;
            return;
        }
        const availableBullet = this.bullets.find(b => !b.isActive);
        if (availableBullet !== undefined) {
            availableBullet.fire(this.direction, this.position.x, this.position.y);
            this.reloadTimer = 10;
        }
    }
}