import Entity from './entity';
import UfoProjectile from './ufo-projectile';
import Sprite from '../utils/sprite';

const VELOCITY = 100;
const RADIUS = 15;
const RELOAD_TIMER= 240;

const SPRITE_SOURCE = '../assets/ufo.png';
const SPRITE_FRAMES = 1;
const FRAME_HEIGHT = 31;
const FRAME_WIDTH = 31;

export default class Ufo extends Entity {
    private readonly target: Entity;
    private readonly sprite: Sprite;
    private reloadTimer = 0;

    constructor(x: number, y: number, target: Entity) {
        super({x, y}, RADIUS, {x: VELOCITY, y: VELOCITY}, Math.random() * (2 * Math.PI));
        this.target = target;
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.sprite.render(ctx, this.x, this.y);
        this.drawDebugHelpers(ctx);
    }

    public update(delta: number): void {
        this.reloadTimer--;
        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        if (Math.random() < 0.005) this.changeDirection();
        this.handleAreaBoundsCheck();
    }

    public isReadyToFire(): boolean {
        return this.reloadTimer <= 0 && Math.random() < 0.006;
    }

    public fireProjectile(): UfoProjectile {
        this.reloadTimer = RELOAD_TIMER;
        const targetDirection = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        return new UfoProjectile(this.position, targetDirection);
    }

    private changeDirection(): void {
        const modifier = Math.random() + 0.5;
        if(Math.random() > 0.5) {
            this.direction += modifier;
        } else {
            this.direction -= modifier;
        }
    }

}