import Konva from 'konva';
import { Component, ComponentOptions } from '../core/Component';

export type ImageViewOptions = ComponentOptions & {
    image?: string | HTMLImageElement;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export class ImageView extends Component<ImageViewOptions> {
    private image?: string | HTMLImageElement;
    private objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' = 'contain';

    private imageObject: HTMLImageElement | null = null;
    private imageLoaded: boolean = false;

    private imageNode!: Konva.Image;
    
    constructor(options: ImageViewOptions = {} as ImageViewOptions) {
        super(options);

        // Set options
        this.image = options.image || this.image;
        this.objectFit = options.objectFit || this.objectFit;

        // Initialize
        this.init();
    }

    private init() {
        // Create image node
        this.imageNode = new Konva.Image({
            image: undefined,
            width: this.width(),
            height: this.height(),
            objectFit: this.objectFit,
        });

        this.add(this.imageNode);

        if (this.image) {
            this.loadImage(this.image);
        }
    }

    private loadImage(source: string | HTMLImageElement) {
        // If source is an HTMLImageElement, use it directly
        if (source instanceof HTMLImageElement) {
            this.imageObject = source;
            if (source.complete && source.naturalWidth !== 0) {
                this.imageLoaded = true;
                this.updateImage();
            } else {
                source.onload = () => {
                    this.imageLoaded = true;
                    this.updateImage();
                };
            }
            return;
        }

        // Otherwise, create a new image object
        this.imageObject = new Image();
        // this.imageObject.crossOrigin = 'Anonymous';     // To prevent CORS issues
        this.imageObject.onload = () => {
            this.imageLoaded = true;
            this.updateImage();
        };
        this.imageObject.onerror = () => {
            this.imageLoaded = false;
            console.error('Failed to load image:', source);
        };
        this.imageObject.src = source;
    }
    
    private updateImage() {
        if (!this.imageObject) {
            return;
        }

        if (this.imageLoaded) {
            this.imageNode.image(this.imageObject);
            this.fitImage();
        } else {
            this.imageNode.image(null);
        }
    }

    private fitImage() {
        if (!this.imageObject || !this.imageLoaded) {
            return;
        }

        const containerWidth = this.width();
        const containerHeight = this.height();
        const imageWidth = this.imageObject.naturalWidth;
        const imageHeight = this.imageObject.naturalHeight;

        // Calculate scale factors
        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        
        // Initialize default values
        let width = 0;
        let height = 0;
        let offsetX = 0;
        let offsetY = 0;

        switch (this.objectFit) {
            case 'contain':
                // Choose the smallest ratio to ensure the image fits within the container
                const containScale = Math.min(scaleX, scaleY);
                width = imageWidth * containScale;
                height = imageHeight * containScale;
                
                // Center the image within the container
                offsetX = (containerWidth - width) / 2;
                offsetY = (containerHeight - height) / 2;
                break;
                
            case 'cover':
                // Choose the largest ratio to ensure the image covers the entire container
                const coverScale = Math.max(scaleX, scaleY);
                width = imageWidth * coverScale;
                height = imageHeight * coverScale;
                
                // Center the image and crop the excess
                offsetX = (containerWidth - width) / 2;
                offsetY = (containerHeight - height) / 2;
                break;
                
            case 'fill':
                // Stretch the image to fill the container without maintaining the aspect ratio
                width = containerWidth;
                height = containerHeight;
                offsetX = 0;
                offsetY = 0;
                break;
                
            case 'none':
                // Display the image with its original size, without scaling
                width = imageWidth;
                height = imageHeight;
                
                // Center the image if it's smaller than the container
                offsetX = imageWidth < containerWidth ? (containerWidth - imageWidth) / 2 : 0;
                offsetY = imageHeight < containerHeight ? (containerHeight - imageHeight) / 2 : 0;
                break;
                
            case 'scale-down':
                // scale-down = min(none, contain)
                // If the image is smaller than the container, display the original size (none)
                // Otherwise, use the contain mode
                if (imageWidth <= containerWidth && imageHeight <= containerHeight) {
                    // Use the none mode
                    width = imageWidth;
                    height = imageHeight;
                } else {
                    // Use the contain mode
                    const scaleDownScale = Math.min(scaleX, scaleY);
                    width = imageWidth * scaleDownScale;
                    height = imageHeight * scaleDownScale;
                }
                
                // Center the image
                offsetX = (containerWidth - width) / 2;
                offsetY = (containerHeight - height) / 2;
                break;
                
            default:
                // Default to the contain mode
                const defaultScale = Math.min(scaleX, scaleY);
                width = imageWidth * defaultScale;
                height = imageHeight * defaultScale;
                offsetX = (containerWidth - width) / 2;
                offsetY = (containerHeight - height) / 2;
                break;
        }

        // Update the size and position of the imageNode
        this.imageNode.width(width);
        this.imageNode.height(height);
        this.imageNode.x(offsetX);
        this.imageNode.y(offsetY);
        
        // Set clip to prevent the image from overflowing the container if needed
        if (this.objectFit === 'cover' || this.objectFit === 'fill') {
            this.imageNode.crop({
                x: 0,
                y: 0,
                width: containerWidth,
                height: containerHeight
            });
        } else {
            this.imageNode.crop(undefined);
        }
    }
    
    setImage(image: string | HTMLImageElement) {
        this.imageLoaded = false;
        this.loadImage(image);
    }

    setObjectFit(objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down') {
        this.objectFit = objectFit;
        this.fitImage();
    }

    getImageWidth(): number {
        return this.imageObject?.naturalWidth || 0;
    }

    getImageHeight(): number {
        return this.imageObject?.naturalHeight || 0;
    }

    setSize(size: { width: number; height: number; }): this {
        super.setSize(size);

        this.fitImage();

        return this;
    }
}
