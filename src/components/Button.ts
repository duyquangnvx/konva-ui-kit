import Konva from 'konva';
import { Component, ComponentOptions } from '../core/Component';

export type ButtonOptions = ComponentOptions & {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: string;
    fontColor?: string;
    hoverColor?: string;
    activeColor?: string;
}

export class Button extends Component<ButtonOptions> {
    private text: string = 'Button';
    private fontSize: number = 16;
    private fontFamily: string = 'Arial';
    private fontStyle: string = 'normal';
    private fontColor: string = '#000000';
    private hoverColor: string = '#2980b9';
    private activeColor: string = '#1c638d';

    private isHovered: boolean = false;
    private isActive: boolean = false;

    private textNode!: Konva.Text;

    constructor(options: ButtonOptions = {} as ButtonOptions) {
        super(options);

        // Set options
        this.text = options.text || this.text;
        this.fontSize = options.fontSize || this.fontSize;
        this.fontFamily = options.fontFamily || this.fontFamily;
        this.fontStyle = options.fontStyle || this.fontStyle;
        this.fontColor = options.fontColor || this.fontColor;
        this.hoverColor = options.hoverColor || this.hoverColor;
        this.activeColor = options.activeColor || this.activeColor;

        // Initialize
        this.init();
    }

    private init() {
        // Create text node
        this.textNode = new Konva.Text({
            text: this.text,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            fontStyle: this.fontStyle,
            fill: this.fontColor,
            align: 'center',
            verticalAlign: 'middle',
            width: this.width(),
            height: this.height(),
            padding: 0,
        });

        this.alignText();

        this.add(this.textNode);

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.listening()) return;

        this.on('mouseenter', () => {
            this.isHovered = true;
            this.updateButtonState();
        });

        this.on('mouseleave', () => {
            this.isHovered = false;
            this.isActive = false;
            this.updateButtonState();
        });

        this.on('mousedown touchstart', () => {
            this.isActive = true;
            this.updateButtonState();
        });

        this.on('mouseup touchend', () => { 
            this.isActive = false;
            this.updateButtonState();
        });
    }

    private updateButtonState() {
        if (this.isActive) {
            this.background.fill(this.activeColor);
        } else if (this.isHovered) {
            this.background.fill(this.hoverColor);
        } else {
            this.background.fill(this.backgroundColor);
        }
    }

    setText(text: string) {
        this.text = text;
        this.textNode.text(text);
    }

    setFontSize(fontSize: number) { 
        this.fontSize = fontSize;
        this.textNode.fontSize(fontSize);
    }

    setFontFamily(fontFamily: string) {
        this.fontFamily = fontFamily;
        this.textNode.fontFamily(fontFamily);
    }

    setFontStyle(fontStyle: string) {
        this.fontStyle = fontStyle;
        this.textNode.fontStyle(fontStyle);
    }

    setFontColor(fontColor: string) {
        this.fontColor = fontColor;
        this.textNode.fill(fontColor);
    }

    setHoverColor(hoverColor: string) {
        this.hoverColor = hoverColor;

        this.updateButtonState();
    }
    
    setActiveColor(activeColor: string) {
        this.activeColor = activeColor;

        this.updateButtonState();
    }

    setSize(size: { width: number, height: number }): this {
        super.setSize(size);

        const { width, height } = size;

        this.textNode.width(width);
        this.textNode.height(height);

        this.alignText();

        return this;
    }

    private alignText() {
        this.textNode.offsetX(this.textNode.width() / 2);
        this.textNode.offsetY(this.textNode.height() / 2);
        this.textNode.x(this.width() / 2);
        this.textNode.y(this.height() / 2);
    }
}

