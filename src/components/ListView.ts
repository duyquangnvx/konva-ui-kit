import Konva from "konva";
import { ScrollView, ScrollViewOptions } from "./ScrollView";

export enum ItemAlign {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
    STRETCH = 'stretch'
}

export type ListViewRenderItem = (item: any, index: number) => Konva.Group | Konva.Shape;

export type ListViewOptions = ScrollViewOptions & {
    items?: any[];
    renderItem?: ListViewRenderItem;
    onItemClick?: (item: any, index: number) => void;
    onItemHover?: (item: any, index: number) => void;
    itemHeight?: number;
    itemSpacing?: number;
    autoHeight?: boolean;
    horizontal?: boolean;
    itemAlign?: ItemAlign;
}

export class ListView extends ScrollView {

    private items: any[] = [];
    private renderItem: ListViewRenderItem | undefined;
    private onItemClick: ((item: any, index: number) => void) | undefined;
    private onItemHover: ((item: any, index: number) => void) | undefined;
    
    private itemHeight: number = 50;
    private itemSpacing: number = 5;
    private autoHeight: boolean = false;
    private horizontal: boolean = false;
    private itemAlign: ItemAlign = ItemAlign.LEFT;
    private itemsContainer: Konva.Group;
    private renderedItems: Map<number, Konva.Node> = new Map();

    constructor(options: ListViewOptions = {} as ListViewOptions) {
        // Set default scroll direction based on orientation
        if (options.horizontal) {
            if (options.scrollDirection === undefined) {
                options.scrollDirection = 'horizontal';
            }
        } else {
            if (options.scrollDirection === undefined) {
                options.scrollDirection = 'vertical';
            }
        }
        
        super(options);

        this.items = options.items || [];
        this.renderItem = options.renderItem;
        this.onItemClick = options.onItemClick;
        this.onItemHover = options.onItemHover;
        
        // Set additional options
        this.itemHeight = options.itemHeight || this.itemHeight;
        this.itemSpacing = options.itemSpacing !== undefined ? options.itemSpacing : this.itemSpacing;
        this.autoHeight = options.autoHeight !== undefined ? options.autoHeight : this.autoHeight;
        this.horizontal = options.horizontal !== undefined ? options.horizontal : this.horizontal;
        this.itemAlign = options.itemAlign || this.itemAlign;
        
        // Create container for list items
        this.itemsContainer = new Konva.Group();
        this.getContentContainer().add(this.itemsContainer);
        
        // Initialize list
        this.renderList();
    }
    
    /**
     * Render all list items
     */
    private renderList(): void {
        // Clear existing items
        this.itemsContainer.destroyChildren();
        this.renderedItems.clear();
        
        if (!this.renderItem || this.items.length === 0) {
            return;
        }
        
        // Calculate total content size
        let totalWidth = 0;
        let totalHeight = 0;
        
        // First pass: render items and calculate sizes
        const renderedItems: { item: any; node: Konva.Group | Konva.Shape; width: number; height: number }[] = [];
        
        this.items.forEach((item, index) => {
            const renderedItem = this.renderItem!(item, index);
            const itemWidth = renderedItem.width() || this.itemHeight;
            const itemHeight = renderedItem.height() || this.itemHeight;
            
            renderedItems.push({
                item,
                node: renderedItem,
                width: itemWidth,
                height: itemHeight
            });
            
            // Update total dimensions
            if (this.horizontal) {
                totalWidth += itemWidth + this.itemSpacing;
                totalHeight = Math.max(totalHeight, itemHeight);
            } else {
                totalHeight += itemHeight + this.itemSpacing;
                totalWidth = Math.max(totalWidth, itemWidth);
            }
        });
        
        // Remove last spacing
        if (this.items.length > 0) {
            if (this.horizontal) {
                totalWidth -= this.itemSpacing;
            } else {
                totalHeight -= this.itemSpacing;
            }
        }
        
        // Second pass: position items with alignment
        let currentOffset = 0;
        
        renderedItems.forEach(({ item, node, width, height }, index) => {
            let xPos = 0;
            let yPos = 0;
            
            // Get item offset if it exists
            const itemOffset = {
                x: node.offsetX() || 0,
                y: node.offsetY() || 0
            };
            
            // Store original offset to restore it later if needed
            const originalOffsetX = itemOffset.x;
            const originalOffsetY = itemOffset.y;
            
            if (this.horizontal) {
                // For horizontal lists
                yPos = 0;
                xPos = currentOffset;
                
                // Apply vertical alignment
                if (this.itemAlign === ItemAlign.CENTER) {
                    yPos = (totalHeight - height) / 2;
                } else if (this.itemAlign === ItemAlign.RIGHT) {
                    yPos = totalHeight - height;
                } else if (this.itemAlign === ItemAlign.STRETCH) {
                    node.height(totalHeight);
                }
                
                currentOffset += width + this.itemSpacing;
            } else {
                // For vertical lists
                xPos = 0;
                yPos = currentOffset;
                
                // Apply horizontal alignment
                if (this.itemAlign === ItemAlign.CENTER) {
                    xPos = (this.width() - width) / 2;
                } else if (this.itemAlign === ItemAlign.RIGHT) {
                    xPos = this.width() - width;
                } else if (this.itemAlign === ItemAlign.STRETCH) {
                    node.width(this.width());
                }
                
                currentOffset += height + this.itemSpacing;
            }
            
            // If the node is already using offset for centering (like Button), 
            // we need to adjust the position to account for that offset
            if (itemOffset.x > 0 || itemOffset.y > 0) {
                // When an item has offset, its logical position (the one we set with position())
                // needs to be adjusted so that its visual position is correct
                node.position({
                    x: xPos + itemOffset.x,
                    y: yPos + itemOffset.y
                });
            } else {
                // For nodes without offset, set position directly
                node.position({ x: xPos, y: yPos });
            }
            
            // Add event handlers
            this.attachEventHandlers(node, item, index);
            
            // Add to container and keep reference
            this.itemsContainer.add(node);
            this.renderedItems.set(index, node);
        });
        
        // Update content size
        this.setContentSize(
            this.horizontal ? totalWidth : this.width(),
            this.horizontal ? this.height() : totalHeight
        );
        
        // If auto height is enabled, adjust the list view height
        if (this.autoHeight && !this.horizontal && this.items.length > 0) {
            this.height(Math.min(totalHeight, 500)); // Set a reasonable max height
        }
    }
    
    /**
     * Attach event handlers to list items
     */
    private attachEventHandlers(node: Konva.Group | Konva.Shape, item: any, index: number): void {
        // Click/tap event with better touch support
        if (this.onItemClick) {
            // Use separate handlers for mouse and touch events
            node.on('mousedown touchstart', (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
                // Store the initial position for tracking if this is a click or a scroll
                const evt = e.evt;
                const isTouch = evt.type === 'touchstart' || evt.type.includes('touch');
                
                // Store initial position
                const touchId = isTouch ? 'touch_start' : 'mouse_start';
                const position = isTouch 
                    ? { x: (evt as TouchEvent).touches[0].clientX, y: (evt as TouchEvent).touches[0].clientY }
                    : { x: (evt as MouseEvent).clientX, y: (evt as MouseEvent).clientY };
                    
                node.setAttr(touchId, position);
                
                // Don't prevent default yet, to allow scrolling
            });
            
            // Detect click/tap end
            node.on('mouseup touchend', (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
                const evt = e.evt;
                const isTouch = evt.type === 'touchend' || evt.type.includes('touch');
                
                // Retrieve initial position
                const touchId = isTouch ? 'touch_start' : 'mouse_start';
                const startPos = node.getAttr(touchId);
                
                if (!startPos) return; // No start position recorded
                
                // Get current position
                let currentPos;
                if (isTouch) {
                    // For touchend, we need to use changedTouches since touches will be empty
                    const changedTouches = (evt as TouchEvent).changedTouches;
                    if (changedTouches.length === 0) return;
                    currentPos = { x: changedTouches[0].clientX, y: changedTouches[0].clientY };
                } else {
                    currentPos = { x: (evt as MouseEvent).clientX, y: (evt as MouseEvent).clientY };
                }
                
                // Calculate distance moved
                const distance = Math.sqrt(
                    Math.pow(currentPos.x - startPos.x, 2) + 
                    Math.pow(currentPos.y - startPos.y, 2)
                );
                
                // If moved less than threshold, consider it a click
                if (distance < 10) { // 10px threshold
                    // Prevent default behavior for touch events to avoid double actions
                    e.evt.preventDefault();
                    e.cancelBubble = true;
                    
                    // Check if the touch point is within this node's bounds
                    // Convert global position to stage position
                    const stage = node.getStage();
                    if (!stage) return;
                    
                    // Get pointer position in stage coordinates
                    const stagePoint = stage.getPointerPosition();
                    if (!stagePoint) return;
                    
                    // Now check if this point is inside the node
                    const nodeBounds = node.getClientRect();
                    
                    // Use a simple bounds check to make touch detection more forgiving on mobile
                    // Add a small buffer (5px) to the bounds
                    const buffer = 5;
                    if (
                        stagePoint.x >= nodeBounds.x - buffer &&
                        stagePoint.x <= nodeBounds.x + nodeBounds.width + buffer &&
                        stagePoint.y >= nodeBounds.y - buffer &&
                        stagePoint.y <= nodeBounds.y + nodeBounds.height + buffer
                    ) {
                        if (this.onItemClick) {
                            this.onItemClick(item, index);
                        }
                    }
                }
                
                // Clear stored position
                node.setAttr(touchId, null);
            });
            
            // Also handle touch cancel
            node.on('touchcancel', () => {
                node.setAttr('touch_start', null);
            });
        }
        
        // Hover events - only for mouse, not touch
        if (this.onItemHover) {
            node.on('mouseenter', () => {
                if (this.onItemHover) {
                    this.onItemHover(item, index);
                }
            });
        }
        
        // Add pointer cursor for clickable items
        if (this.onItemClick) {
            node.on('mouseenter', () => {
                const stage = node.getStage();
                if (stage) {
                    stage.container().style.cursor = 'pointer';
                }
            });
            
            node.on('mouseleave', () => {
                const stage = node.getStage();
                if (stage) {
                    stage.container().style.cursor = 'default';
                }
            });
        }
    }
    
    /**
     * Set or update list items
     */
    setItems(items: any[]): void {
        this.items = items || [];
        this.renderList();
    }
    
    /**
     * Add an item to the list
     */
    addItem(item: any): void {
        this.items.push(item);
        this.renderList();
    }
    
    /**
     * Remove an item at specified index
     */
    removeItem(index: number): void {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.renderList();
        }
    }
    
    /**
     * Update an item at specified index
     */
    updateItem(index: number, item: any): void {
        if (index >= 0 && index < this.items.length) {
            this.items[index] = item;
            this.renderList();
        }
    }
    
    /**
     * Get all items
     */
    getItems(): any[] {
        return [...this.items];
    }
    
    /**
     * Get an item at specified index
     */
    getItem(index: number): any {
        if (index >= 0 && index < this.items.length) {
            return this.items[index];
        }
        return null;
    }
    
    /**
     * Get the number of items
     */
    getItemCount(): number {
        return this.items.length;
    }
    
    /**
     * Scroll to a specific item
     */
    scrollToItem(index: number, animated: boolean = true): void {
        if (index < 0 || index >= this.items.length) {
            return;
        }
        
        const item = this.renderedItems.get(index);
        if (!item) {
            return;
        }
        
        // Get item position relative to content container
        const position = item.absolutePosition();
        const containerPosition = this.getContentContainer().absolutePosition();
        
        // Calculate relative position
        const relativeX = position.x - containerPosition.x;
        const relativeY = position.y - containerPosition.y;
        
        // Get current scroll position
        const { x: scrollX, y: scrollY } = this.getScrollPosition();
        
        // Calculate target scroll position
        let targetX = scrollX;
        let targetY = scrollY;
        
        if (this.horizontal) {
            targetX = relativeX;
        } else {
            targetY = relativeY;
        }
        
        if (animated) {
            // Animate scroll to item
            const duration = 0.3; // seconds
            const steps = 20;
            const stepX = (targetX - scrollX) / steps;
            const stepY = (targetY - scrollY) / steps;
            
            let currentStep = 0;
            const anim = new Konva.Animation((frame) => {
                if (currentStep >= steps) {
                    anim.stop();
                    this.scrollTo(targetX, targetY);
                    return;
                }
                
                currentStep++;
                this.scrollTo(
                    scrollX + stepX * currentStep,
                    scrollY + stepY * currentStep
                );
            });
            
            anim.start();
        } else {
            // Scroll immediately
            this.scrollTo(targetX, targetY);
        }
    }
    
    /**
     * Override setSize to update list layout
     */
    setSize(size: { width: number, height: number }): this {
        super.setSize(size);
        this.renderList();
        return this;
    }
    
    /**
     * Set item height
     */
    setItemHeight(height: number): void {
        this.itemHeight = height;
        this.renderList();
    }
    
    /**
     * Set item spacing
     */
    setItemSpacing(spacing: number): void {
        this.itemSpacing = spacing;
        this.renderList();
    }
    
    /**
     * Set horizontal mode
     */
    setHorizontal(horizontal: boolean): void {
        this.horizontal = horizontal;
        this.setScrollDirection(horizontal ? 'horizontal' : 'vertical');
        this.renderList();
    }

    /**
     * Set item alignment
     */
    setItemAlign(align: ItemAlign): void {
        this.itemAlign = align;
        this.renderList();
    }

    /**
     * Get current item alignment
     */
    getItemAlign(): ItemAlign {
        return this.itemAlign;
    }

    doLayout(): void {
        this.renderList();
    }
}