import Entity from './entity';
import Sprite from '../utils/sprite';
import AsteroidCategory from './asteroid-category';

// Minimum velocity of an asteroid
const MIN_VELOCITY = 25;

// Sprite constants
const SPRITE_SOURCE = './assets/asteroids.png';
const SPRITE_FRAMES = 6;
const FRAME_HEIGHT = 111;
const FRAME_WIDTH = 111;

// Sprite frame indices by asteroid category
const FRAME_INDEX = {
    [AsteroidCategory.Large]: [0, 1],
    [AsteroidCategory.Medium]: [2, 3],
    [AsteroidCategory.Small]: [4, 5],
}

// Radii by asteroid category
const RADIUS = {
    [AsteroidCategory.Large]: 60,
    [AsteroidCategory.Medium]: 40,
    [AsteroidCategory.Small]: 20,
}

// Velocity modifiers by asteroid category
const VELOCITY_MODIFIER = {
    [AsteroidCategory.Large]: 50,
    [AsteroidCategory.Medium]: 100,
    [AsteroidCategory.Small]: 150,
}

export default class Asteroid extends Entity {
    public readonly category: AsteroidCategory;

    private readonly sprite: Sprite;

    /**
     * @param x - Asteroid's x-coordinate.
     * @param y - Asteroid's y-coordinate.
     * @param category - Size of the asteroid.
     */
    constructor(x: number, y: number, category: AsteroidCategory) {
        const direction = Math.random() * (2 * Math.PI);
        const radius = RADIUS[category];
        const velocity = MIN_VELOCITY + (Math.random() * VELOCITY_MODIFIER[category]);
        const frame = FRAME_INDEX[category][Math.floor(Math.random() * 2)]

        super({ x, y }, radius, { x: velocity, y: velocity }, direction);
        this.sprite = new Sprite(SPRITE_SOURCE, SPRITE_FRAMES, FRAME_WIDTH, FRAME_HEIGHT);
        this.sprite.setFrame(frame);
        this.category = category;
    }

    /**
     * @inheritdoc
     */
    public render(ctx: CanvasRenderingContext2D): void {
        this.sprite.render(ctx, this.x, this.y);
        // this.sprite.rotate(0.002);
        super.drawDebugHelpers(ctx);
    }

    /**
     * @inheritdoc
     */
    public update(delta: number): void {
        this.position.x += (Math.cos(this.direction) * this.velocity.x * delta);
        this.position.y += (Math.sin(this.direction) * this.velocity.y * delta);

        super.handleAreaBoundsCheck();
    }
}
