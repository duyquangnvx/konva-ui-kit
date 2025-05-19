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
    
    // Shadow options
    shadowEnabled?: boolean;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    
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

    protected background!: Konva.Rect;

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

        this.initBackground();
    }

    private initBackground() {
        // Create background
        this.background = new Konva.Rect({
            width: this.width(),
            height: this.height(),
            fill: this.backgroundColor,
            opacity: this.backgroundOpacity,
            cornerRadius: this.backgroundCornerRadius,
            stroke: this.backgroundBorderColor,
            strokeWidth: this.backgroundBorderWidth,
            shadowColor: this.shadowColor,
            shadowBlur: this.shadowBlur,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            visible: this.backgroundEnabled,
        });

        this.add(this.background);
    }

    setBackgroundEnabled(backgroundEnabled: boolean): this {
        this.backgroundEnabled = backgroundEnabled;
        this.background.visible(backgroundEnabled);
        return this;
    }

    setBackgroundColor(backgroundColor: string): this {
        this.backgroundColor = backgroundColor;
        this.background.fill(backgroundColor);
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

        return this;
    }

    update(deltaTime: number): void {

    }
}


