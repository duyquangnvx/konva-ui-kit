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
    hoverActionEnabled?: boolean;
    hoverZoomScale?: number;
    textAlign?: string;
    textVerticalAlign?: string;
}

export class Button extends Component<ButtonOptions> {
    private text: string = 'Button';
    private fontSize: number = 16;
    private fontFamily: string = 'Arial';
    private fontStyle: string = 'normal';
    private fontColor: string = '#000000';
    private hoverColor: string = '#2980b9';
    private activeColor: string = '#1c638d';
    private hoverActionEnabled: boolean = false;
    private hoverZoomScale: number = 0.05;
    private textAlign: string = 'center';
    private textVerticalAlign: string = 'middle';

    private isHovered: boolean = false;
    private isActive: boolean = false;
    private originalScale: { x: number, y: number } = { x: 1, y: 1 };

    private textNode!: Konva.Text;
    private readonly RECT_WIDTH_RATIO: number = 0.92;

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
        this.hoverActionEnabled = options.hoverActionEnabled !== undefined ? options.hoverActionEnabled : this.hoverActionEnabled;
        this.hoverZoomScale = options.hoverZoomScale !== undefined ? options.hoverZoomScale : this.hoverZoomScale;
        this.textAlign = options.textAlign || this.textAlign;
        this.textVerticalAlign = options.textVerticalAlign || this.textVerticalAlign;

        // Store original scale
        this.saveOriginalScale();

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
            align: this.textAlign,
            verticalAlign: this.textVerticalAlign,
            width: this.width() * this.RECT_WIDTH_RATIO,
            height: this.height(),
            padding: 0,
        });

        this.alignText();

        // Set offset to center for scaling from center
        this.setOffsetFromCenter();

        this.add(this.textNode);

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.listening()) return;

        this.on('mouseenter', () => {
            this.isHovered = true;
            this.updateButtonState();
            
            if (this.hoverActionEnabled) {
                this.applyHoverScale(true);
            }
        });

        this.on('mouseleave', () => {
            this.isHovered = false;
            this.isActive = false;
            this.updateButtonState();
            
            if (this.hoverActionEnabled) {
                this.applyHoverScale(false);
            }
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

    private saveOriginalScale() {
        this.originalScale = {
            x: this.scaleX(),
            y: this.scaleY()
        };
    }

    private applyHoverScale(hovered: boolean) {
        if (hovered) {
            this.to({
                scaleX: this.originalScale.x * (1 + this.hoverZoomScale),
                scaleY: this.originalScale.y * (1 + this.hoverZoomScale),
                duration: 0.1,
                easing: Konva.Easings.EaseOut
            });
        } else {
            this.to({
                scaleX: this.originalScale.x,
                scaleY: this.originalScale.y,
                duration: 0.1,
                easing: Konva.Easings.EaseIn
            });
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

    setTextAlign(textAlign: string) {
        this.textAlign = textAlign;
        this.textNode.align(textAlign);
    }

    setTextVerticalAlign(textVerticalAlign: string) {
        this.textVerticalAlign = textVerticalAlign;
        this.textNode.verticalAlign(textVerticalAlign);
    }

    setHoverColor(hoverColor: string) {
        this.hoverColor = hoverColor;

        this.updateButtonState();
    }
    
    setActiveColor(activeColor: string) {
        this.activeColor = activeColor;

        this.updateButtonState();
    }

    setHoverActionEnabled(enabled: boolean) {
        this.hoverActionEnabled = enabled;
    }

    setHoverZoomScale(scale: number) {
        this.hoverZoomScale = scale;
    }

    setSize(size: { width: number, height: number }): this {
        // Get current position before updating size
        const pos = this.position();
        const oldOffset = this.offset();
        
        // Update size in parent
        super.setSize(size);

        const { width, height } = size;

        this.textNode.width(width);
        this.textNode.height(height);

        this.alignText();
        
        // Update offset to new center
        this.offset({
            x: width / 2,
            y: height / 2
        });
        
        // Adjust position to keep the button in the same visual place
        // after changing the offset
        if (oldOffset.x !== 0 || oldOffset.y !== 0) {
            this.position({
                x: pos.x - oldOffset.x + width / 2,
                y: pos.y - oldOffset.y + height / 2
            });
        }

        return this;
    }

    private alignText() {
        this.textNode.offsetX(this.textNode.width() / 2);
        this.textNode.offsetY(this.textNode.height() / 2);
        this.textNode.x(this.width() / 2);
        this.textNode.y(this.height() / 2);
    }

    private setOffsetFromCenter() {
        // Set the offset to half of width and height to scale from center
        this.offset({
            x: this.width() / 2,
            y: this.height() / 2
        });
        
        // Adjust position to compensate for offset
        const pos = this.position();
        this.position({
            x: pos.x + this.width() / 2,
            y: pos.y + this.height() / 2
        });
    }
}

