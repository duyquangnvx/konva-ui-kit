import Konva from "konva";
import { ScrollView, ScrollViewOptions } from "./ScrollView";

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
        
        // Render each item
        this.items.forEach((item, index) => {
            const renderedItem = this.renderItem!(item, index);
            
            // Set position based on orientation
            if (this.horizontal) {
                renderedItem.x(totalWidth);
                renderedItem.y(0);
                
                // Update width for next item
                const itemWidth = renderedItem.width() || this.itemHeight;
                totalWidth += itemWidth + this.itemSpacing;
                totalHeight = Math.max(totalHeight, renderedItem.height() || this.itemHeight);
            } else {
                renderedItem.x(0);
                renderedItem.y(totalHeight);
                
                // Update height for next item
                const itemHeight = renderedItem.height() || this.itemHeight;
                totalHeight += itemHeight + this.itemSpacing;
                totalWidth = Math.max(totalWidth, renderedItem.width() || this.width());
            }
            
            // Add event handlers
            this.attachEventHandlers(renderedItem, item, index);
            
            // Add to container and keep reference
            this.itemsContainer.add(renderedItem);
            this.renderedItems.set(index, renderedItem);
        });
        
        // Remove last spacing
        if (this.items.length > 0) {
            if (this.horizontal) {
                totalWidth -= this.itemSpacing;
            } else {
                totalHeight -= this.itemSpacing;
            }
        }
        
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
    private attachEventHandlers(node: Konva.Node, item: any, index: number): void {
        // Click event
        if (this.onItemClick) {
            node.on('click tap', () => {
                if (this.onItemClick) {
                    this.onItemClick(item, index);
                }
            });
        }
        
        // Hover events
        if (this.onItemHover) {
            node.on('mouseenter', () => {
                if (this.onItemHover) {
                    this.onItemHover(item, index);
                }
            });
        }
        
        // Add pointer cursor
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
}