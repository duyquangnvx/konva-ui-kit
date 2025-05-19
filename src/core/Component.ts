import Konva from 'konva';

export type ComponentOptions = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    visible?: boolean;
    opacity?: number;
    listening?: boolean;
}

export class Component<T extends ComponentOptions> extends Konva.Group {
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
    }

    setSize(size: { width: number, height: number }): this {
        this.width(size.width);
        this.height(size.height);

        return this;
    }

    update(deltaTime: number): void {

    }
}


