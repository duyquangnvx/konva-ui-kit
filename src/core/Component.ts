import Konva from 'konva';

export type ComponentOptions = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    visible?: boolean;
    opacity?: number;
    listening?: boolean;

    // Background options
    backgroundEnabled?: boolean;
    backgroundColor?: string;
    backgroundOpacity?: number;
    backgroundCornerRadius?: number;
    backgroundBorderWidth?: number;
    backgroundBorderColor?: string;
    
    // Gradient options
    backgroundGradientEnabled?: boolean;
    backgroundLinearGradientColorStops?: (string | number)[]; // e.g., [0, 'red', 0.5, 'yellow', 1, 'blue']
    backgroundLinearGradientStartPoint?: { x: number; y: number }; // Values 0-1 relative to component size, default {x: 0.5, y: 0} (top-center)
    backgroundLinearGradientEndPoint?: { x: number; y: number };   // Values 0-1 relative to component size, default {x: 0.5, y: 1} (bottom-center)
    
    // Pattern options
    backgroundPatternImageSource?: string | HTMLImageElement | HTMLCanvasElement;
    backgroundPatternOffset?: { x: number; y: number };
    backgroundPatternRepeat?: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
    backgroundPatternScale?: { x: number; y: number };
    backgroundPatternRotation?: number; // degrees
    
    // Shadow options
    shadowEnabled?: boolean;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    
    [key: string]: any;
}

export class Component<T extends ComponentOptions> extends Konva.Group {
    protected backgroundEnabled: boolean = true;
    protected backgroundColor: string = 'transparent';
    protected backgroundOpacity: number = 1;
    protected backgroundCornerRadius: number = 0;
    protected backgroundBorderWidth: number = 0;
    protected backgroundBorderColor: string = '#000000';

    protected shadowEnabled: boolean = false;
    protected shadowColor: string = '#000000';
    protected shadowBlur: number = 0;
    protected shadowOffsetX: number = 0;
    protected shadowOffsetY: number = 0;

    // Gradient properties
    protected backgroundGradientEnabled: boolean = false;
    protected backgroundLinearGradientColorStops: (string | number)[] = [];
    protected backgroundLinearGradientStartPoint: { x: number; y: number } = { x: 0.5, y: 0 }; // Default: top-center
    protected backgroundLinearGradientEndPoint: { x: number; y: number } = { x: 0.5, y: 1 };   // Default: bottom-center

    // Pattern properties
    protected backgroundPatternImageSource?: string | HTMLImageElement | HTMLCanvasElement;
    protected backgroundPatternOffset: { x: number; y: number } = { x: 0, y: 0 };
    protected backgroundPatternRepeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' = 'repeat';
    protected backgroundPatternScale: { x: number; y: number } = { x: 1, y: 1 };
    protected backgroundPatternRotation: number = 0;

    protected background!: Konva.Rect;

    private animation?: Konva.Animation; // Add property for animation

    constructor(options: T = {} as T) {
        super({
            x: options.x || 0,
            y: options.y || 0,
            width: options.width || 0,
            height: options.height || 0,
            visible: options.visible || true,
            opacity: options.opacity || 1,
            listening: options.listening || true,
        });

        // Set options
        this.backgroundEnabled = options.backgroundEnabled || this.backgroundEnabled;
        this.backgroundColor = options.backgroundColor || this.backgroundColor;
        this.backgroundOpacity = options.backgroundOpacity || this.backgroundOpacity;
        this.backgroundCornerRadius = options.backgroundCornerRadius || this.backgroundCornerRadius;
        this.backgroundBorderWidth = options.backgroundBorderWidth || this.backgroundBorderWidth;
        this.backgroundBorderColor = options.backgroundBorderColor || this.backgroundBorderColor;

        this.shadowEnabled = options.shadowEnabled || this.shadowEnabled;
        this.shadowColor = options.shadowColor || this.shadowColor;
        this.shadowBlur = options.shadowBlur || this.shadowBlur;
        this.shadowOffsetX = options.shadowOffsetX || this.shadowOffsetX;
        this.shadowOffsetY = options.shadowOffsetY || this.shadowOffsetY;

        // Set gradient options
        this.backgroundGradientEnabled = options.backgroundGradientEnabled ?? this.backgroundGradientEnabled;
        this.backgroundLinearGradientColorStops = options.backgroundLinearGradientColorStops ?? this.backgroundLinearGradientColorStops;
        this.backgroundLinearGradientStartPoint = options.backgroundLinearGradientStartPoint ?? { ...this.backgroundLinearGradientStartPoint };
        this.backgroundLinearGradientEndPoint = options.backgroundLinearGradientEndPoint ?? { ...this.backgroundLinearGradientEndPoint };
        
        // Set pattern options
        this.backgroundPatternImageSource = options.backgroundPatternImageSource ?? this.backgroundPatternImageSource;
        this.backgroundPatternOffset = options.backgroundPatternOffset ?? { ...this.backgroundPatternOffset };
        this.backgroundPatternRepeat = options.backgroundPatternRepeat ?? this.backgroundPatternRepeat;
        this.backgroundPatternScale = options.backgroundPatternScale ?? { ...this.backgroundPatternScale };
        this.backgroundPatternRotation = options.backgroundPatternRotation ?? this.backgroundPatternRotation;

        this.initBackground();
    }

    private initBackground() {
        // Create background
        this.background = new Konva.Rect({
            width: this.width(),
            height: this.height(),
            // fill and opacity are set via applyBackgroundFill and direct opacity setting
            cornerRadius: this.backgroundCornerRadius,
            stroke: this.backgroundBorderColor,
            strokeWidth: this.backgroundBorderWidth,
            shadowColor: this.shadowColor,
            shadowBlur: this.shadowBlur,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            visible: this.backgroundEnabled,
        });

        this.applyBackgroundFill();
        this.background.opacity(this.backgroundOpacity);

        this.add(this.background);
    }

    private applyBackgroundFill() {
        if (this.backgroundPatternImageSource) {
            this.background.fill(null); // Clear solid fill
            this.background.fillLinearGradientColorStops(undefined);
            this.background.fillLinearGradientStartPoint(undefined);
            this.background.fillLinearGradientEndPoint(undefined);
            this.background.fillPriority('pattern');

            const applyPatternProperties = (imageElement: HTMLImageElement | HTMLCanvasElement) => {
                this.background.fillPatternImage(imageElement);
                this.background.fillPatternOffset(this.backgroundPatternOffset);
                this.background.fillPatternRepeat(this.backgroundPatternRepeat);
                this.background.fillPatternScale(this.backgroundPatternScale);
                this.background.fillPatternRotation(this.backgroundPatternRotation);
                this.getLayer()?.batchDraw();
            };

            if (typeof this.backgroundPatternImageSource === 'string') {
                Konva.Image.fromURL(this.backgroundPatternImageSource, (imgNode: Konva.Image) => {
                    const imageElement = imgNode.image();
                    if (imageElement) {
                        applyPatternProperties(imageElement as HTMLImageElement | HTMLCanvasElement);
                    } else {
                        console.error('Failed to load image for pattern from URL:', this.backgroundPatternImageSource);
                    }
                });
            } else { // HTMLImageElement or HTMLCanvasElement
                applyPatternProperties(this.backgroundPatternImageSource);
            }
        } else if (this.backgroundGradientEnabled && this.backgroundLinearGradientColorStops && this.backgroundLinearGradientColorStops.length > 0) {
            this.background.fillPatternImage(undefined); // Clear pattern fill
            this.background.fill(null); // Clear solid fill before applying gradient
            this.background.fillLinearGradientStartPoint({
                x: this.backgroundLinearGradientStartPoint.x * this.width(),
                y: this.backgroundLinearGradientStartPoint.y * this.height()
            });
            this.background.fillLinearGradientEndPoint({
                x: this.backgroundLinearGradientEndPoint.x * this.width(),
                y: this.backgroundLinearGradientEndPoint.y * this.height()
            });
            this.background.fillLinearGradientColorStops(this.backgroundLinearGradientColorStops);
            this.background.fillPriority('linear-gradient');
        } else {
            this.background.fillLinearGradientColorStops(undefined);
            this.background.fillLinearGradientStartPoint(undefined);
            this.background.fillLinearGradientEndPoint(undefined);
            this.background.fill(this.backgroundColor);
            this.background.fillPriority('color');
        }
    }

    setBackgroundEnabled(backgroundEnabled: boolean): this {
        this.backgroundEnabled = backgroundEnabled;
        this.background.visible(backgroundEnabled);
        return this;
    }

    setBackgroundColor(backgroundColor: string): this {
        this.backgroundColor = backgroundColor;
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundOpacity(backgroundOpacity: number): this {
        this.backgroundOpacity = backgroundOpacity;
        this.background.opacity(backgroundOpacity);
        return this;
    }

    setBackgroundCornerRadius(backgroundCornerRadius: number): this {
        this.backgroundCornerRadius = backgroundCornerRadius;
        this.background.cornerRadius(backgroundCornerRadius);
        return this;
    }
    
    setBackgroundBorderWidth(backgroundBorderWidth: number): this {
        this.backgroundBorderWidth = backgroundBorderWidth;
        this.background.strokeWidth(backgroundBorderWidth);
        return this;
    }

    setBackgroundBorderColor(backgroundBorderColor: string): this {
        this.backgroundBorderColor = backgroundBorderColor;
        this.background.stroke(backgroundBorderColor);
        return this;
    }
    
    setBackgroundGradientEnabled(enabled: boolean): this {
        this.backgroundGradientEnabled = enabled;
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundLinearGradientColorStops(stops: (string | number)[]): this {
        this.backgroundLinearGradientColorStops = stops;
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundLinearGradientStartPoint(point: { x: number; y: number }): this {
        this.backgroundLinearGradientStartPoint = { ...point }; // Store a copy
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundLinearGradientEndPoint(point: { x: number; y: number }): this {
        this.backgroundLinearGradientEndPoint = { ...point }; // Store a copy
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundPatternImageSource(source?: string | HTMLImageElement | HTMLCanvasElement): this {
        this.backgroundPatternImageSource = source;
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundPatternOffset(offset: { x: number; y: number }): this {
        this.backgroundPatternOffset = { ...offset };
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundPatternRepeat(repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'): this {
        this.backgroundPatternRepeat = repeat;
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundPatternScale(scale: { x: number; y: number }): this {
        this.backgroundPatternScale = { ...scale };
        this.applyBackgroundFill();
        return this;
    }

    setBackgroundPatternRotation(rotation: number): this {
        this.backgroundPatternRotation = rotation;
        this.applyBackgroundFill();
        return this;
    }
    
    setShadowEnabled(shadowEnabled: boolean): this {
        this.shadowEnabled = shadowEnabled;
        this.background.shadowEnabled(shadowEnabled);
        return this;
    }

    setShadowColor(shadowColor: string): this {
        this.shadowColor = shadowColor;
        this.background.shadowColor(shadowColor);
        return this;
    }

    setShadowBlur(shadowBlur: number): this {
        this.shadowBlur = shadowBlur;
        this.background.shadowBlur(shadowBlur);
        return this;
    }
    
    setShadowOffsetX(shadowOffsetX: number): this {
        this.shadowOffsetX = shadowOffsetX;
        this.background.shadowOffsetX(shadowOffsetX);
        return this;
    }

    setShadowOffsetY(shadowOffsetY: number): this {
        this.shadowOffsetY = shadowOffsetY;
        this.background.shadowOffsetY(shadowOffsetY);
        return this;
    }

    setSize(size: { width: number, height: number }): this {
        this.width(size.width);
        this.height(size.height);

        this.background.width(size.width);
        this.background.height(size.height);
        this.applyBackgroundFill(); // Recalculate gradient absolute points

        return this;
    }
    
    update(deltaTime: number): void {

    }

    // New method for animation
    public startPatternAnimation(period: number = 8000, distanceToTravel: number): void {
        if (this.animation) {
            this.animation.stop(); // Stop any existing animation
        }

        this.animation = new Konva.Animation(frame => {
            if (!frame) return;
            const time = frame.time; // milliseconds
            let offsetX = -((time / period) * distanceToTravel) % distanceToTravel;
            this.setBackgroundPatternOffset({ x: offsetX, y: 0 });
        }, this.getLayer());

        if (this.animation) {
            this.animation.start();
        }
    }

    public stopPatternAnimation(): void {
        if (this.animation) {
            this.animation.stop();
            this.animation = undefined;
        }
    }
}


