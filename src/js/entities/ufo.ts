import Entity from './entity';
import Vector2D from '../utils/vector2d';
import UfoProjectile from './ufo-projectile';
import Sprite from '../utils/sprite';

const SPRITE_SOURCE = '../assets/ufo.png';
const SPRITE_FRAMES = 1;
const FRAME_HEIGHT = 31;
const FRAME_WIDTH = 31;


export default class Ufo extends Entity {
    private readonly target: Entity;
    private readonly sprite: Sprite;
    private reloadTimer = 0;

    constructor(target: Entity) {
        super(new Vector2D(100, 100), 15, new Vector2D(100, 100), 0);
        this.target = target;
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = '#f9f9f9'

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 15, 0, Math.PI * 2);
        ctx.moveTo(this.position.x, this.position.y);

        ctx.stroke();
        ctx.closePath();

        this.sprite.render(ctx, this.x, this.y);
    }

    public update(delta: number): void {
        this.reloadTimer--;
        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        if (Math.random() < 0.002) this.changeDirection();
        this.handleAreaBoundsCheck();
    }


    public isReadyToFire(): boolean {
        return this.reloadTimer <= 0 && Math.random() < 0.006;
    }

    public fireProjectile(): UfoProjectile {
        this.reloadTimer = 240;
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
        this.direction %= 360;
    }

}