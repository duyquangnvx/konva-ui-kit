import Konva from 'konva';
import { Component, ComponentOptions } from '../core/Component';

export type LabelOptions = ComponentOptions & {
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: string;
    fontColor?: string;
    fill?: string;
    align?: string;
    verticalAlign?: string;
    padding?: number;
    ellipsis?: boolean;
    autoSize?: boolean;
}

export class Label extends Component<LabelOptions> {
    private text: string = 'Label';
    private fontSize: number = 16;
    private fontFamily: string = 'Arial';
    private fontStyle: string = 'normal';
    private fontColor: string = '#000000';
    private fill: string = '#000000';
    private align: string = 'left';
    private verticalAlign: string = 'middle';
    private padding: number = 0;
    private ellipsis: boolean = false;
    private autoSize: boolean = false;

    private textNode!: Konva.Text;

    constructor(options: LabelOptions = {} as LabelOptions) {
        super(options);

        // Set options
        this.text = options.text || this.text;
        this.fontSize = options.fontSize || this.fontSize;
        this.fontFamily = options.fontFamily || this.fontFamily;
        this.fontStyle = options.fontStyle || this.fontStyle;
        this.fontColor = options.fontColor || this.fontColor;
        this.fill = options.fill || this.fill;
        this.align = options.align || this.align;
        this.verticalAlign = options.verticalAlign || this.verticalAlign;
        this.padding = options.padding || this.padding;
        this.ellipsis = options.ellipsis || this.ellipsis;
        this.autoSize = options.autoSize ?? this.autoSize;

        // Initialize
        this.init();
    }
    
  
    private init() {
        this.textNode = new Konva.Text({
            text: this.text,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            fontStyle: this.fontStyle,
            fill: this.fill,
            align: this.align,
            verticalAlign: this.verticalAlign,
            padding: this.padding,
            width: this.width(),
            height: this.height(),
            listening: this.listening(),
            ellipsis: this.ellipsis,
        });

        // Add nodes to group
        this.add(this.textNode);

        this.alignText();

        if (this.autoSize) {
            this.resizeToFitText();
        }

    }

    private alignText() {
        this.textNode.offsetX(this.textNode.width() / 2);
        this.textNode.offsetY(this.textNode.height() / 2);
        this.textNode.x(this.width() / 2);
        this.textNode.y(this.height() / 2);
    }

    setText(text: string) {
        this.text = text;
        this.textNode.text(text);

        if (this.autoSize) {
            this.resizeToFitText();
        }
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

    setFill(fill: string) {
        this.fill = fill;
        this.textNode.fill(fill);
    }
    
    setAlign(align: string) {
        this.align = align;
        this.textNode.align(align);
    }

    setVerticalAlign(verticalAlign: string) {
        this.verticalAlign = verticalAlign;
        this.textNode.verticalAlign(verticalAlign);
    }

    setPadding(padding: number) {
        this.padding = padding;
        this.textNode.padding(padding);
    }
     
    setEllipsis(ellipsis: boolean) {
        this.ellipsis = ellipsis;
        this.textNode.ellipsis(ellipsis);
    }
     
    setSize(size: { width: number, height: number }): this {
        super.setSize(size);

        const { width, height } = size;

        this.textNode.width(width);
        this.textNode.height(height);

        this.alignText();

        return this;
    }

    getTextWidth(): number {
        return this.textNode.width();
    }

    getTextHeight(): number {
        return this.textNode.height();
    }

    resizeToFitText(): this {
        const textSize = this.textNode.measureSize(this.textNode.text());

        const textWidth = textSize.width;
        const textHeight = textSize.height;

        const width = textWidth + (this.padding * 2);
        const height = textHeight + (this.padding * 2);

        this.setSize({ width, height });

        return this;
    }
}
    

