import Konva from 'konva';
import { Component, ComponentOptions } from '../core/Component';
import { KonvaEventObject } from 'konva/lib/Node';

export type ScrollViewOptions = ComponentOptions & {
    scrollbarEnabled?: boolean;
    scrollbarColor?: string;
    scrollbarWidth?: number;
    scrollbarHeight?: number;
    scrollbarCornerRadius?: number;
    scrollbarBorderWidth?: number;
    scrollbarBorderColor?: string;
    scrollbarOpacity?: number;
    scrollbarFadeTime?: number;

    scrollDirection?: 'vertical' | 'horizontal' | 'both';
    scrollSpeed?: number;
    bounceEnabled?: boolean;
    bounceStrength?: number;
    inertiaEnabled?: boolean;
    inertiaDecay?: number; // Higher means less inertia (0.95 is good)

    contentWidth?: number;
    contentHeight?: number;
    
    onScroll?: (scrollX: number, scrollY: number) => void;
};

interface TouchPoint {
    id: string;
    x: number;
    y: number;
    time: number;
}

interface ScrollVelocity {
    x: number;
    y: number;
}

export class ScrollView extends Component<ScrollViewOptions> {
    // Scrollbar properties
    private scrollbarEnabled: boolean = true;
    private scrollbarColor: string = '#888888';
    private scrollbarWidth: number = 8;
    private scrollbarHeight: number = 8;
    private scrollbarCornerRadius: number = 4;
    private scrollbarBorderWidth: number = 0;
    private scrollbarBorderColor: string = '#000000';
    private scrollbarOpacity: number = 0.6;
    private scrollbarFadeTime: number = 1000;  // milliseconds

    // Scroll behavior
    private scrollDirection: 'vertical' | 'horizontal' | 'both' = 'both';
    private scrollSpeed: number = 1;
    private bounceEnabled: boolean = false;
    private bounceStrength: number = 0.2;
    private inertiaEnabled: boolean = true;
    private inertiaDecay: number = 0.95; // Changed from 0.95 to 0.95 for better inertia feel

    // Content size
    private contentWidth: number = 0;
    private contentHeight: number = 0;
    
    // Callback
    private onScrollCallback?: (scrollX: number, scrollY: number) => void;

    // Internal properties
    private scrollX: number = 0;
    private scrollY: number = 0;
    private maxScrollX: number = 0;
    private maxScrollY: number = 0;
    private scrollVelocity: ScrollVelocity = { x: 0, y: 0 };
    private lastScrollTime: number = 0;
    private scrollbarFadeTimeout: ReturnType<typeof setTimeout> | null = null;
    
    // UI elements
    private verticalScrollbar!: Konva.Rect;
    private horizontalScrollbar!: Konva.Rect;
    private contentContainer!: Konva.Group;
    private scrollbarContainer!: Konva.Group;
    
    // Touch handling
    private dragging: boolean = false;
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private lastTouchX: number = 0;
    private lastTouchY: number = 0;
    private touchPoints: TouchPoint[] = [];
    private touchStartTime: number = 0;
    private lastTouchTime: number = 0;
    private animation: Konva.Animation | null = null;
    private autoScrollActive: boolean = false;
    private animationFrameId: number | null = null;
    
    constructor(options: ScrollViewOptions = {} as ScrollViewOptions) {
        super(options);
        
        // Set scrollbar options
        this.scrollbarEnabled = options.scrollbarEnabled !== undefined ? options.scrollbarEnabled : this.scrollbarEnabled;
        this.scrollbarColor = options.scrollbarColor || this.scrollbarColor;
        this.scrollbarWidth = options.scrollbarWidth || this.scrollbarWidth;
        this.scrollbarHeight = options.scrollbarHeight || this.scrollbarHeight;
        this.scrollbarCornerRadius = options.scrollbarCornerRadius || this.scrollbarCornerRadius;
        this.scrollbarBorderWidth = options.scrollbarBorderWidth || this.scrollbarBorderWidth;
        this.scrollbarBorderColor = options.scrollbarBorderColor || this.scrollbarBorderColor;
        this.scrollbarOpacity = options.scrollbarOpacity !== undefined ? options.scrollbarOpacity : this.scrollbarOpacity;
        this.scrollbarFadeTime = options.scrollbarFadeTime || this.scrollbarFadeTime;

        // Set scroll behavior options
        this.scrollDirection = options.scrollDirection || this.scrollDirection;
        this.scrollSpeed = options.scrollSpeed || this.scrollSpeed;
        this.bounceEnabled = options.bounceEnabled !== undefined ? options.bounceEnabled : this.bounceEnabled;
        this.bounceStrength = options.bounceStrength || this.bounceStrength;
        this.inertiaEnabled = options.inertiaEnabled !== undefined ? options.inertiaEnabled : this.inertiaEnabled;
        this.inertiaDecay = options.inertiaDecay || this.inertiaDecay;

        // Set content size
        this.contentWidth = options.contentWidth || this.width();
        this.contentHeight = options.contentHeight || this.height();
        
        // Set callback
        this.onScrollCallback = options.onScroll;
        
        // Initialize
        this.init();
    }

    private init() {
        // Add clip to prevent content from appearing outside the scroll view
        this.clip({
            x: 0,
            y: 0,
            width: this.width(),
            height: this.height(),
        });
        
        // Create content container
        this.contentContainer = new Konva.Group({
            x: 0,
            y: 0,
            width: this.contentWidth,
            height: this.contentHeight,
        });
        
        // Create scrollbar container
        this.scrollbarContainer = new Konva.Group();
        
        // Create scrollbars
        this.createScrollbars();
        
        // Add elements to the component
        this.add(this.contentContainer);
        this.add(this.scrollbarContainer);
        
        // Calculate max scroll values
        this.updateMaxScroll();
        
        // Set up event handlers
        this.setupEventHandlers();
    }

    /**
     * Create scrollbars for both vertical and horizontal scrolling
     */
    private createScrollbars() {
        const padding = 2;
        
        // Create vertical scrollbar
        this.verticalScrollbar = new Konva.Rect({
            x: this.width() - this.scrollbarWidth - padding,
            y: padding,
            width: this.scrollbarWidth,
            height: 50, // Initial height, will be updated
            fill: this.scrollbarColor,
            cornerRadius: this.scrollbarCornerRadius,
            stroke: this.scrollbarBorderColor,
            strokeWidth: this.scrollbarBorderWidth,
            opacity: 0, // Start hidden
            visible: this.scrollbarEnabled && (this.scrollDirection === 'vertical' || this.scrollDirection === 'both'),
        });
        
        // Create horizontal scrollbar
        this.horizontalScrollbar = new Konva.Rect({
            x: padding,
            y: this.height() - this.scrollbarHeight - padding,
            width: 50, // Initial width, will be updated
            height: this.scrollbarHeight,
            fill: this.scrollbarColor,
            cornerRadius: this.scrollbarCornerRadius,
            stroke: this.scrollbarBorderColor,
            strokeWidth: this.scrollbarBorderWidth,
            opacity: 0, // Start hidden
            visible: this.scrollbarEnabled && (this.scrollDirection === 'horizontal' || this.scrollDirection === 'both'),
        });
        
        // Add scrollbars to container
        this.scrollbarContainer.add(this.verticalScrollbar);
        this.scrollbarContainer.add(this.horizontalScrollbar);
        
        // Initial update
        this.updateScrollbars();
    }

    /**
     * Update scrollbar sizes and positions based on content size and scroll position
     */
    private updateScrollbars() {
        if (!this.scrollbarEnabled) {
            this.verticalScrollbar.visible(false);
            this.horizontalScrollbar.visible(false);
            return;
        }
        
        const padding = 2;
        const minScrollbarSize = 20; // Minimum scrollbar size in pixels
        
        // Update vertical scrollbar
        if (this.scrollDirection === 'vertical' || this.scrollDirection === 'both') {
            this.verticalScrollbar.visible(this.contentHeight > this.height());
            
            if (this.contentHeight > this.height()) {
                // Calculate scrollbar size as proportion of the view height to content height
                const heightRatio = Math.min(1, this.height() / this.contentHeight);
                const scrollbarHeight = Math.max(minScrollbarSize, this.height() * heightRatio - padding * 2);
                
                // Calculate scrollbar position
                const scrollRatio = this.maxScrollY === 0 ? 0 : this.scrollY / this.maxScrollY;
                const scrollableHeight = this.height() - scrollbarHeight - padding * 2;
                const scrollbarY = padding + scrollableHeight * scrollRatio;
                
                // Update scrollbar
                this.verticalScrollbar.height(scrollbarHeight);
                this.verticalScrollbar.y(scrollbarY);
            }
        } else {
            this.verticalScrollbar.visible(false);
        }
        
        // Update horizontal scrollbar
        if (this.scrollDirection === 'horizontal' || this.scrollDirection === 'both') {
            this.horizontalScrollbar.visible(this.contentWidth > this.width());
            
            if (this.contentWidth > this.width()) {
                // Calculate scrollbar size as proportion of the view width to content width
                const widthRatio = Math.min(1, this.width() / this.contentWidth);
                const scrollbarWidth = Math.max(minScrollbarSize, this.width() * widthRatio - padding * 2);
                
                // Calculate scrollbar position
                const scrollRatio = this.maxScrollX === 0 ? 0 : this.scrollX / this.maxScrollX;
                const scrollableWidth = this.width() - scrollbarWidth - padding * 2;
                const scrollbarX = padding + scrollableWidth * scrollRatio;
                
                // Update scrollbar
                this.horizontalScrollbar.width(scrollbarWidth);
                this.horizontalScrollbar.x(scrollbarX);
            }
        } else {
            this.horizontalScrollbar.visible(false);
        }
        
        // Show scrollbars
        this.fadeInScrollbars();
    }

    /**
     * Show scrollbars and set timeout to fade them out
     */
    private fadeInScrollbars() {
        // Clear any existing timeout
        if (this.scrollbarFadeTimeout) {
            clearTimeout(this.scrollbarFadeTimeout);
            this.scrollbarFadeTimeout = null;
        }
        
        // Show scrollbars immediately
        this.verticalScrollbar.opacity(this.scrollbarOpacity);
        this.horizontalScrollbar.opacity(this.scrollbarOpacity);
        
        // Set timeout to fade out scrollbars
        this.scrollbarFadeTimeout = setTimeout(() => {
            // Animate fade out
            const fadeAnim = new Konva.Tween({
                node: this.verticalScrollbar,
                opacity: 0,
                duration: 0.3,
                easing: Konva.Easings.EaseOut,
            });
            
            const fadeAnim2 = new Konva.Tween({
                node: this.horizontalScrollbar,
                opacity: 0,
                duration: 0.3,
                easing: Konva.Easings.EaseOut,
            });
            
            fadeAnim.play();
            fadeAnim2.play();
            
            this.scrollbarFadeTimeout = null;
        }, this.scrollbarFadeTime);
    }

    /**
     * Set up event handlers for user interaction
     */
    private setupEventHandlers() {
        if (!this.listening()) {
            return;
        }
        
        // Mouse wheel event
        this.on('wheel', (event: KonvaEventObject<WheelEvent>) => {
            // Prevent default behavior
            event.evt.preventDefault();
            
            // Apply scroll speed
            let deltaX = event.evt.deltaX * this.scrollSpeed;
            let deltaY = event.evt.deltaY * this.scrollSpeed;
            
            // Respect scroll direction setting
            if (this.scrollDirection === 'vertical') {
                deltaX = 0;
            } else if (this.scrollDirection === 'horizontal') {
                deltaY = 0;
            }
            
            // Apply scroll
            this.scrollBy(deltaX, deltaY);
        });
        
        // Touch/mouse events
        this.on('mousedown touchstart', this.onTouchBegan.bind(this));
        this.on('mousemove touchmove', this.onTouchMoved.bind(this));
        this.on('mouseup touchend', this.onTouchEnded.bind(this));
        this.on('mouseleave', this.onTouchCancelled.bind(this));
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateMaxScroll();
            this.updateScrollbars();
        });
    }

    /**
     * Handle touch/mouse down event
     */
    private onTouchBegan(event: KonvaEventObject<MouseEvent | TouchEvent>) {
        // Stop any ongoing animation
        this.stopMomentumScroll();
        
        // Reset velocity
        this.scrollVelocity = { x: 0, y: 0 };
        
        // Record the start position of the touch
        this.dragging = true;
        
        // Store touch/mouse position
        if (event.type === 'touchstart') {
            const evt = event.evt as TouchEvent;
            const touch = evt.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.lastTouchX = touch.clientX;
            this.lastTouchY = touch.clientY;
            
            // Track all touch points for multi-touch
            this.touchPoints = [];
            for (let i = 0; i < evt.touches.length; i++) {
                const t = evt.touches[i];
                this.touchPoints.push({
                    id: t.identifier.toString(),
                    x: t.clientX,
                    y: t.clientY,
                    time: Date.now(),
                });
            }
        } else {
            // Get mouse position
            const evt = event.evt as MouseEvent;
            this.touchStartX = evt.clientX;
            this.touchStartY = evt.clientY;
            this.lastTouchX = evt.clientX;
            this.lastTouchY = evt.clientY;
        }
        
        this.touchStartTime = Date.now();
        this.lastTouchTime = Date.now();
    }

    /**
     * Handle touch/mouse move event
     */
    private onTouchMoved(event: KonvaEventObject<MouseEvent | TouchEvent>) {
        if (!this.dragging) {
            return;
        }
        
        // Prevent default to stop scrolling the page
        event.evt.preventDefault();
        
        let currentX: number;
        let currentY: number;
        
        if (event.type === 'touchmove') {
            const evt = event.evt as TouchEvent;
            const touch = evt.touches[0];
            currentX = touch.clientX;
            currentY = touch.clientY;
            
            // Update all touch points
            const newTouchPoints: TouchPoint[] = [];
            for (let i = 0; i < evt.touches.length; i++) {
                const t = evt.touches[i];
                newTouchPoints.push({
                    id: t.identifier.toString(),
                    x: t.clientX,
                    y: t.clientY,
                    time: Date.now(),
                });
            }
            this.touchPoints = newTouchPoints;
            
            // Handle multi-touch (average movement for first two touches)
            if (evt.touches.length >= 2 && this.touchPoints.length >= 2) {
                let sumDeltaX = 0;
                let sumDeltaY = 0;
                
                for (let i = 0; i < Math.min(2, evt.touches.length); i++) {
                    const touch = evt.touches[i];
                    const prevTouch = this.touchPoints.find(t => t.id === touch.identifier.toString());
                    
                    if (prevTouch) {
                        sumDeltaX += prevTouch.x - touch.clientX;
                        sumDeltaY += prevTouch.y - touch.clientY;
                    }
                }
                
                // Average of movements
                const deltaX = sumDeltaX / 2;
                const deltaY = sumDeltaY / 2;
                
                // Respect scroll direction setting
                if (this.scrollDirection === 'vertical') {
                    this.scrollBy(0, deltaY * this.scrollSpeed);
                } else if (this.scrollDirection === 'horizontal') {
                    this.scrollBy(deltaX * this.scrollSpeed, 0);
                } else {
                    this.scrollBy(deltaX * this.scrollSpeed, deltaY * this.scrollSpeed);
                }
                
                return;
            }
        } else {
            const evt = event.evt as MouseEvent;
            currentX = evt.clientX;
            currentY = evt.clientY;
        }
        
        // Calculate drag distance
        const dx = this.lastTouchX - currentX;
        const dy = this.lastTouchY - currentY;
        
        // Respect scroll direction setting
        if (this.scrollDirection === 'vertical') {
            this.scrollBy(0, dy);
        } else if (this.scrollDirection === 'horizontal') {
            this.scrollBy(dx, 0);
        } else {
            this.scrollBy(dx, dy);
        }
        
        // Calculate velocity with improved scaling for better feel
        const now = Date.now();
        const timeDelta = (now - this.lastTouchTime) / 1000; // Convert to seconds
        
        if (timeDelta > 0) {
            // Scale factor of 15 provides more realistic momentum
            this.scrollVelocity = {
                x: (dx / timeDelta) * this.scrollSpeed * 15,
                y: (dy / timeDelta) * this.scrollSpeed * 15,
            };
        }
        
        this.lastTouchX = currentX;
        this.lastTouchY = currentY;
        this.lastTouchTime = now;
    }

    /**
     * Handle touch/mouse up event
     */
    private onTouchEnded(event: KonvaEventObject<MouseEvent | TouchEvent>) {
        if (!this.dragging) {
            return;
        }
        
        if (event.type === 'touchend') {
            const evt = event.evt as TouchEvent;
            // Remove ended touches from tracking
            for (let i = 0; i < evt.changedTouches.length; i++) {
                const touch = evt.changedTouches[i];
                const id = touch.identifier.toString();
                this.touchPoints = this.touchPoints.filter(point => point.id !== id);
            }
            
            // If any touches remain, don't end dragging
            if (this.touchPoints.length > 0) {
                return;
            }
        }
        
        this.dragging = false;
        
        // Start momentum scrolling if velocity is high enough
        if (this.inertiaEnabled && 
            (Math.abs(this.scrollVelocity.x) > 10 || Math.abs(this.scrollVelocity.y) > 10)) {
            this.startMomentumScroll();
        }
    }

    /**
     * Handle touch/mouse cancel event
     */
    private onTouchCancelled(event: KonvaEventObject<MouseEvent | TouchEvent>) {
        if (!this.dragging) {
            return;
        }
        
        this.dragging = false;
        
        // Start momentum scrolling if velocity is high enough
        if (this.inertiaEnabled && 
            (Math.abs(this.scrollVelocity.x) > 10 || Math.abs(this.scrollVelocity.y) > 10)) {
            this.startMomentumScroll();
        } else {
            this.scrollVelocity = { x: 0, y: 0 };
        }
    }

    /**
     * Start momentum scrolling with requestAnimationFrame for smoother animation
     */
    private startMomentumScroll() {
        // Stop any existing animation
        this.stopMomentumScroll();
        
        this.autoScrollActive = true;
        
        const animate = () => {
            if (!this.autoScrollActive) {
                return;
            }
            
            // Apply decay to slow down
            this.scrollVelocity.x *= this.inertiaDecay;
            this.scrollVelocity.y *= this.inertiaDecay;
            
            // Calculate time-based movement
            const deltaX = this.scrollVelocity.x / 60; // Assuming 60fps
            const deltaY = this.scrollVelocity.y / 60;
            
            // Apply scroll
            this.scrollBy(deltaX, deltaY);
            
            // Stop animation when velocity becomes very small
            if (Math.abs(this.scrollVelocity.x) < 0.5 && Math.abs(this.scrollVelocity.y) < 0.5) {
                this.autoScrollActive = false;
                this.animationFrameId = null;
                return;
            }
            
            // Continue animation
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * Stop momentum scrolling
     */
    private stopMomentumScroll() {
        this.autoScrollActive = false;
        
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.animation?.isRunning()) {
            this.animation.stop();
        }
    }

    /**
     * Update maximum scroll values based on content size
     */
    private updateMaxScroll() {
        // Calculate max scroll values based on content size and view port size
        // Ensure we don't have any extra space at the end of the scroll
        this.maxScrollX = Math.max(0, Math.ceil(this.contentWidth) - Math.floor(this.width()));
        this.maxScrollY = Math.max(0, Math.ceil(this.contentHeight) - Math.floor(this.height()));
        
        // Apply constraints to current scroll position if it exceeds new limits
        if (this.scrollX > this.maxScrollX) {
            this.scrollTo(this.maxScrollX, this.scrollY);
        }
        
        if (this.scrollY > this.maxScrollY) {
            this.scrollTo(this.scrollX, this.maxScrollY);
        }
    }

    /**
     * Scroll to specific position
     */
    scrollTo(x: number, y: number) {
        // Store original values for callback
        const originalX = x;
        const originalY = y;
        
        // Apply constraints
        let targetX = x;
        let targetY = y;
        
        if (!this.bounceEnabled) {
            // Hard limit if bounce is disabled
            targetX = Math.max(0, Math.min(this.maxScrollX, targetX));
            targetY = Math.max(0, Math.min(this.maxScrollY, targetY));
        } else {
            // Apply bounce effect
            if (targetX < 0) {
                targetX *= this.bounceStrength;
            } else if (targetX > this.maxScrollX && this.maxScrollX > 0) {
                const overscroll = targetX - this.maxScrollX;
                targetX = this.maxScrollX + overscroll * this.bounceStrength;
            } else if (this.maxScrollX <= 0) {
                targetX = 0;
            }
            
            if (targetY < 0) {
                targetY *= this.bounceStrength;
            } else if (targetY > this.maxScrollY && this.maxScrollY > 0) {
                const overscroll = targetY - this.maxScrollY;
                targetY = this.maxScrollY + overscroll * this.bounceStrength;
            } else if (this.maxScrollY <= 0) {
                targetY = 0;
            }
        }
        
        // Update scroll position
        this.scrollX = targetX;
        this.scrollY = targetY;
        
        // Update content position - use Math.round to prevent sub-pixel positioning issues
        this.contentContainer.x(-Math.round(targetX));
        this.contentContainer.y(-Math.round(targetY));
        
        // Update scrollbars
        this.updateScrollbars();
        
        // Call the scroll callback if provided - use original values
        if (this.onScrollCallback) {
            this.onScrollCallback(originalX, originalY);
        }
    }

    /**
     * Scroll by relative amount
     */
    scrollBy(dx: number, dy: number) {
        this.scrollTo(this.scrollX + dx, this.scrollY + dy);
    }
    
    /**
     * Add a child to the content container
     */
    addChild(child: Konva.Group | Konva.Shape) {
        this.contentContainer.add(child);
        
        // Update content size and max scroll when adding children
        this.updateContentSize();
    }
    
    /**
     * Set the content size
     */
    setContentSize(width: number, height: number) {
        this.contentWidth = Math.ceil(width);
        this.contentHeight = Math.ceil(height);
        
        // Update max scroll values
        this.updateMaxScroll();
        this.updateScrollbars();
        
        // Reset position to 0,0 if content is smaller than viewport
        if (width <= this.width()) {
            this.scrollX = 0;
            this.contentContainer.x(0);
        }
        
        if (height <= this.height()) {
            this.scrollY = 0;
            this.contentContainer.y(0);
        }
    }
    
    /**
     * Update content size based on the children
     */
    updateContentSize() {
        const children = this.contentContainer.getChildren();
        
        if (children.length === 0) {
            return;
        }
        
        let maxX = 0;
        let maxY = 0;
        
        children.forEach(child => {
            const bounds = child.getClientRect({ relativeTo: this.contentContainer });
            maxX = Math.max(maxX, bounds.x + bounds.width);
            maxY = Math.max(maxY, bounds.y + bounds.height);
        });
        
        // Ensure we account for padding/margins by adding a small buffer
        this.setContentSize(maxX + 1, maxY + 1);
    }
    
    /**
     * Override setSize to update internal components
     */
    setSize(size: { width: number, height: number }): this {
        super.setSize(size);
        
        const { width, height } = size;
        
        // Update clip
        this.clip({
            x: 0,
            y: 0,
            width,
            height,
        });
        
        // Update max scroll values
        this.updateMaxScroll();
        
        // Update scrollbar positions
        if (this.verticalScrollbar) {
            this.verticalScrollbar.x(width - this.scrollbarWidth - 2);
        }
        
        if (this.horizontalScrollbar) {
            this.horizontalScrollbar.y(height - this.scrollbarHeight - 2);
        }
        
        // Update scrollbars
        this.updateScrollbars();
        
        return this;
    }
    
    /**
     * Override destroy to clean up
     */
    destroy(): this {
        // Stop momentum scrolling
        this.stopMomentumScroll();
        
        // Clear timeout
        if (this.scrollbarFadeTimeout) {
            clearTimeout(this.scrollbarFadeTimeout);
        }
        
        return super.destroy();
    }
    
    /**
     * Get current scroll position
     */
    getScrollPosition() {
        return {
            x: this.scrollX,
            y: this.scrollY,
        };
    }
    
    /**
     * Get content container
     */
    getContentContainer() {
        return this.contentContainer;
    }

    setScrollDirection(direction: 'vertical' | 'horizontal' | 'both') {
        this.scrollDirection = direction;
        this.updateScrollbars();
    }
}



