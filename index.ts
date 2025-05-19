// Import Konva và UI Components
import Konva from 'konva';
import { Button } from './src/components/Button';
import { Label } from './src/components/Label';
import { ImageView } from './src/components/ImageView';
import { ScrollView } from './src/components/ScrollView';
import { ListView } from './src/components/ListView';

// Khởi tạo stage và layer cho demo container
function createStageAndLayer(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error(`Container with id "${containerId}" not found`);
    }
    
    const stage = new Konva.Stage({
        container: containerId,
        width: container.offsetWidth,
        height: container.offsetHeight
    });
    
    const layer = new Konva.Layer();
    stage.add(layer);
    
    return { stage, layer };
}

// ===== Button Demo =====
function setupButtonDemo() {
    const { stage, layer } = createStageAndLayer('button-demo');
    
    // Basic button
    const basicButton = new Button({
        x: 50,
        y: 50,
        width: 150,
        height: 40,
        text: 'Click Me',
        backgroundColor: '#3498db',
        backgroundCornerRadius: 6,
        hoverColor: '#2980b9',
        activeColor: '#1c638d',
    });
    
    basicButton.on('click', () => {
        console.log('Basic button clicked!');
    });
    
    // Rounded button
    const roundedButton = new Button({
        x: 50,
        y: 110,
        width: 150,
        height: 40,
        text: 'Rounded',
        backgroundColor: '#e74c3c',
        backgroundCornerRadius: 20,
        hoverColor: '#c0392b',
        activeColor: '#922b21',
        fontColor: '#ffffff'
    });
    
    // Bordered button
    const borderedButton = new Button({
        x: 50,
        y: 170,
        width: 150,
        height: 40,
        text: 'Bordered',
        backgroundColor: '#ffffff',
        backgroundCornerRadius: 4,
        backgroundBorderWidth: 2,
        backgroundBorderColor: '#2ecc71',
        hoverColor: '#f8f9fa',
        activeColor: '#e9ecef',
        fontColor: '#2ecc71'
    });
    
    // Large button
    const largeButton = new Button({
        x: 250,
        y: 50,
        width: 200,
        height: 60,
        text: 'Large Button',
        backgroundColor: '#9b59b6',
        backgroundCornerRadius: 8,
        hoverColor: '#8e44ad',
        activeColor: '#6c3483',
        fontColor: '#ffffff',
        fontSize: 20
    });
    
    // Text button
    const textButton = new Button({
        x: 250,
        y: 130,
        width: 200,
        height: 40,
        text: 'Custom Font',
        backgroundColor: '#f1c40f',
        backgroundCornerRadius: 0,
        hoverColor: '#f39c12',
        activeColor: '#d68910',
        fontColor: '#2c3e50',
        fontFamily: 'Arial',
        fontSize: 16,
        fontStyle: 'bold'
    });
    
    // Add to layer
    layer.add(basicButton);
    layer.add(roundedButton);
    layer.add(borderedButton);
    layer.add(largeButton);
    layer.add(textButton);
    
    layer.draw();
    
    // Add event listeners for window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('button-demo');
        if (container) {
            stage.width(container.offsetWidth);
            stage.height(container.offsetHeight);
            layer.draw();
        }
    });
    
    return { stage, layer, buttons: [basicButton, roundedButton, borderedButton, largeButton, textButton] };
}

// ===== Label Demo =====
function setupLabelDemo() {
    const { stage, layer } = createStageAndLayer('label-demo');
    
    // Basic label
    const basicLabel = new Label({
        x: 50,
        y: 50,
        width: 200,
        height: 40,
        text: 'Basic Label',
        fontSize: 16,
        fill: '#333333'
    });
    
    // Label with background
    const bgLabel = new Label({
        x: 50,
        y: 100,
        width: 200,
        height: 40,
        text: 'Label with Background',
        fontSize: 16,
        fill: '#ffffff',
        backgroundColor: '#3498db',
        backgroundCornerRadius: 4,
        padding: 5,
        align: 'center',
        verticalAlign: 'middle'
    });
    
    // Styled label
    const styledLabel = new Label({
        x: 50,
        y: 150,
        width: 200,
        height: 40,
        text: 'Styled Bold Label',
        fontSize: 18,
        fontStyle: 'bold',
        fill: '#e74c3c',
        padding: 5
    });
    
    // Long text with ellipsis
    const ellipsisLabel = new Label({
        x: 50,
        y: 200,
        width: 200,
        height: 40,
        text: 'This is a very long text that will be truncated with ellipsis because it does not fit within the width',
        fontSize: 14,
        fill: '#333333',
        ellipsis: true,
        padding: 5,
        backgroundColor: '#f8f9fa',
        backgroundCornerRadius: 4
    });
    
    // Multi-aligned label
    const rightAlignedLabel = new Label({
        x: 300,
        y: 50,
        width: 200,
        height: 40,
        text: 'Right Aligned',
        fontSize: 16,
        fill: '#333333',
        align: 'right',
        padding: 5,
        backgroundColor: '#f1c40f',
        backgroundCornerRadius: 4
    });
    
    // Centered label
    const centeredLabel = new Label({
        x: 300,
        y: 100,
        width: 200,
        height: 40,
        text: 'Centered Label',
        fontSize: 16,
        fill: '#333333',
        align: 'center',
        verticalAlign: 'middle',
        padding: 5,
        backgroundColor: '#2ecc71',
        backgroundCornerRadius: 20
    });
    
    // Auto-sized label
    const autoSizedLabel = new Label({
        x: 300, 
        y: 150,
        width: 10, // Small initial width
        height: 10, // Small initial height
        text: 'Auto-sized Label',
        fontSize: 16,
        fill: '#333333',
        padding: 10,
        backgroundColor: '#9b59b6',
        backgroundCornerRadius: 4
    });
    
    // Resize to fit text
    autoSizedLabel.resizeToFitText();
    
    // Section title
    const sectionLabel = new Label({
        x: 300,
        y: 200,
        width: 200,
        height: 40,
        text: 'Label Component Demo',
        fontSize: 20,
        fontStyle: 'bold',
        fill: '#34495e',
        align: 'center',
        padding: 5,
        backgroundColor: '#ecf0f1',
        backgroundCornerRadius: 4,
    });
    
    // Add all labels to the layer
    const labels = [
        basicLabel,
        bgLabel,
        styledLabel,
        ellipsisLabel,
        rightAlignedLabel,
        centeredLabel,
        autoSizedLabel,
        sectionLabel
    ];
    
    labels.forEach(label => layer.add(label));
    
    layer.draw();
    
    // Add event listeners for window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('label-demo');
        if (container) {
            stage.width(container.offsetWidth);
            stage.height(container.offsetHeight);
            layer.draw();
        }
    });
    
    return { stage, layer, labels };
}

// ===== ImageView Demo =====
function setupImageViewDemo() {
    const { stage, layer } = createStageAndLayer('imageview-demo');
    
    // Tạo các ImageView với các chế độ khác nhau
    
    // Image với chế độ contain
    const imageContain = new ImageView({
        x: 50,
        y: 50,
        width: 150,
        height: 150,
        image: 'https://konvajs.org/assets/lion.png',
        backgroundColor: '#f0f0f0',
        backgroundOpacity: 1,
        backgroundCornerRadius: 6,
        objectFit: 'contain',
    });
    
    // Image với chế độ cover
    const imageCover = new ImageView({
        x: 250,
        y: 50,
        width: 150,
        height: 150,
        image: 'https://konvajs.org/assets/lion.png',
        backgroundColor: '#f0f0f0',
        backgroundOpacity: 1,
        backgroundCornerRadius: 0,
        objectFit: 'cover',
    });
    
    // Image với chế độ fill
    const imageFill = new ImageView({
        x: 450,
        y: 50,
        width: 150,
        height: 150,
        image: 'https://konvajs.org/assets/lion.png',
        backgroundColor: '#f0f0f0',
        backgroundOpacity: 1,
        backgroundCornerRadius: 6,
        objectFit: 'fill'
    });
    
    // Image với chế độ scale-down
    const imageScaleDown = new ImageView({
        x: 650,
        y: 50,
        width: 150,
        height: 150,
        image: 'https://konvajs.org/assets/lion.png',
        backgroundColor: '#f0f0f0',
        backgroundOpacity: 1,
        backgroundCornerRadius: 6,
        objectFit: 'scale-down',
    });
    
    // Image có border và shadow
    const imageWithShadow = new ImageView({
        x: 50,
        y: 250,
        width: 150,
        height: 150,
        image: 'https://konvajs.org/assets/lion.png',
        backgroundColor: '#ffffff',
        backgroundBorderWidth: 2,
        backgroundBorderColor: '#3498db',
        backgroundCornerRadius: 8,
        shadowEnabled: true,
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowBlur: 10,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        objectFit: 'contain'
    });
    
    // Tạo các labels
    function createLabel(text: string, x: number, y: number) {
        const label = new Konva.Text({
            x: x,
            y: y,
            text: text,
            fontSize: 14,
            fontFamily: 'Arial',
            fill: '#333333'
        });
        return label;
    }
    
    const containLabel = createLabel('objectFit: "contain"', 50, 210);
    const coverLabel = createLabel('objectFit: "cover"', 250, 210);
    const fillLabel = createLabel('objectFit: "fill"', 450, 210);
    const scaleDownLabel = createLabel('objectFit: "scale-down"', 650, 210);
    const shadowLabel = createLabel('with border & shadow', 50, 410);
    
    // Add to layer
    layer.add(imageContain);
    layer.add(imageCover);
    layer.add(imageFill);
    layer.add(imageScaleDown);
    layer.add(imageWithShadow);
    
    layer.add(containLabel);
    layer.add(coverLabel);
    layer.add(fillLabel);
    layer.add(scaleDownLabel);
    layer.add(shadowLabel);
    
    layer.draw();
    
    // Add event listeners for window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('imageview-demo');
        if (container) {
            stage.width(container.offsetWidth);
            stage.height(container.offsetHeight);
            layer.draw();
        }
    });
    
    return { stage, layer, images: [imageContain, imageCover, imageFill, imageScaleDown, imageWithShadow] };
}

// ===== ScrollView Demo =====
function setupScrollViewDemo() {
    const { stage, layer } = createStageAndLayer('scrollview-demo');
    
    // Create ScrollView
    const scrollView = new ScrollView({
        x: 50,
        y: 30,
        width: 300,
        height: 250,
        backgroundColor: '#f9f9f9',
        scrollbarColor: '#3498db',
        scrollbarWidth: 8,
        scrollbarHeight: 8,
        scrollbarCornerRadius: 4,
        scrollDirection: 'both',
        inertiaEnabled: true,
        bounceEnabled: true
    });
    
    // Create title label
    const titleLabel = new Label({
        x: 50,
        y: 5,
        width: 300,
        height: 20,
        text: 'ScrollView (di chuyển chuột hoặc kéo để cuộn)',
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#333333',
        align: 'center'
    });
    
    // Grid configuration
    const blockSize = 100;
    const padding = 10;
    const rows = 7;
    const cols = 5;
    
    // Calculate exact content dimensions
    const contentWidth = cols * blockSize + (cols - 1) * padding;
    const contentHeight = rows * blockSize + (rows - 1) * padding;
    
    // Set content size
    scrollView.setContentSize(contentWidth, contentHeight);
    
    // Create a grid of colored blocks within the ScrollView
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', 
        '#1abc9c', '#d35400', '#34495e', '#27ae60', '#e67e22',
        '#16a085', '#f1c40f', '#2980b9', '#c0392b', '#8e44ad'
    ];
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const colorIndex = (row * cols + col) % colors.length;
            const x = col * (blockSize + padding);
            const y = row * (blockSize + padding);
            
            // Create content item
            const block = new Konva.Group({
                x: x,
                y: y
            });
            
            // Create background rect
            const rect = new Konva.Rect({
                width: blockSize,
                height: blockSize,
                fill: colors[colorIndex],
                cornerRadius: 8,
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowBlur: 5,
                shadowOffset: { x: 2, y: 2 }
            });
            
            // Create label for the block
            const blockLabel = new Konva.Text({
                x: 10,
                y: blockSize / 2 - 10,
                width: blockSize - 20,
                text: `Item ${row * cols + col + 1}`,
                fontSize: 14,
                fontFamily: 'Arial',
                fill: 'white',
                align: 'center'
            });
            
            // Add to group
            block.add(rect);
            block.add(blockLabel);
            
            // Make blocks interactive
            block.on('mouseenter', function() {
                rect.fill(darkenColor(colors[colorIndex], 0.2));
                stage.container().style.cursor = 'pointer';
                layer.draw();
            });
            
            block.on('mouseleave', function() {
                rect.fill(colors[colorIndex]);
                stage.container().style.cursor = 'default';
                layer.draw();
            });
            
            block.on('click', function() {
                alert(`Clicked on Item ${row * cols + col + 1}`);
            });
            
            // Add the block to the ScrollView's content container
            scrollView.addChild(block);
        }
    }
    
    // Utility function to darken a color
    function darkenColor(hex: string, percent: number): string {
        // Convert hex to RGB
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        
        // Darken
        r = Math.max(0, Math.floor(r * (1 - percent)));
        g = Math.max(0, Math.floor(g * (1 - percent)));
        b = Math.max(0, Math.floor(b * (1 - percent)));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Add ScrollView and title to the layer
    layer.add(titleLabel);
    layer.add(scrollView);
    
    // Draw layer
    layer.draw();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('scrollview-demo');
        if (container) {
            stage.width(container.offsetWidth);
            stage.height(container.offsetHeight);
            layer.draw();
        }
    });
    
    return { stage, layer, scrollView };
}

// ===== ListView Demo =====
function setupListViewDemo() {
    const { stage, layer } = createStageAndLayer('listview-demo');
    
    // Create title label
    const titleLabel = new Label({
        x: 50,
        y: 5,
        width: 300,
        height: 20,
        text: 'ListView Demo',
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#333333',
        align: 'center'
    });
    
    // Create sample data
    const listItems = [
        { title: 'Item 1', description: 'Description for item 1', color: '#3498db' },
        { title: 'Item 2', description: 'Description for item 2', color: '#e74c3c' },
        { title: 'Item 3', description: 'Description for item 3', color: '#2ecc71' },
        { title: 'Item 4', description: 'Description for item 4', color: '#f39c12' },
        { title: 'Item 5', description: 'Description for item 5', color: '#9b59b6' },
        { title: 'Item 6', description: 'Description for item 6', color: '#1abc9c' },
        { title: 'Item 7', description: 'Description for item 7', color: '#d35400' },
        { title: 'Item 8', description: 'Description for item 8', color: '#34495e' },
    ];
    
    // Create ListView with vertical layout
    const verticalListView = new ListView({
        x: 50,
        y: 30,
        width: 300,
        height: 250,
        backgroundColor: '#f9f9f9',
        scrollbarColor: '#3498db',
        scrollbarWidth: 8,
        scrollbarHeight: 8,
        scrollbarCornerRadius: 4,
        itemSpacing: 10,
        items: listItems,
        renderItem: (item, index) => {
            // Create item container
            const itemGroup = new Konva.Group({
                width: 300,
                height: 70
            });
            
            // Create background
            const background = new Konva.Rect({
                width: 300,
                height: 70,
                fill: '#ffffff',
                cornerRadius: 8,
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowBlur: 5,
                shadowOffset: { x: 0, y: 2 }
            });
            
            // Create color indicator
            const colorIndicator = new Konva.Rect({
                x: 0,
                y: 0,
                width: 10,
                height: 70,
                fill: item.color,
                cornerRadius: [8, 0, 0, 8]
            });
            
            // Create title
            const title = new Konva.Text({
                x: 20,
                y: 15,
                text: item.title,
                fontSize: 16,
                fontFamily: 'Arial',
                fontStyle: 'bold',
                fill: '#333333',
                width: 260
            });
            
            // Create description
            const description = new Konva.Text({
                x: 20,
                y: 40,
                text: item.description,
                fontSize: 12,
                fontFamily: 'Arial',
                fill: '#777777',
                width: 260
            });
            
            // Add elements to the group
            itemGroup.add(background);
            itemGroup.add(colorIndicator);
            itemGroup.add(title);
            itemGroup.add(description);
            
            return itemGroup;
        },
        onItemClick: (item, index) => {
            console.log(`Clicked on ${item.title} at index ${index}`);
            alert(`Clicked on ${item.title}`);
        }
    });
    
    // Create horizontal ListView
    const horizontalListView = new ListView({
        x: 50,
        y: 300,
        width: 500,
        height: 120,
        backgroundColor: '#f9f9f9',
        scrollbarColor: '#3498db',
        scrollbarWidth: 8,
        scrollbarHeight: 8,
        scrollbarCornerRadius: 4,
        itemSpacing: 10,
        horizontal: true,
        items: listItems.slice(0, 6),
        renderItem: (item, index) => {
            // Create item container
            const itemGroup = new Konva.Group({
                width: 100,
                height: 100
            });
            
            // Create background
            const background = new Konva.Rect({
                width: 100,
                height: 100,
                fill: item.color,
                cornerRadius: 8,
                opacity: 0.8
            });
            
            // Create title
            const title = new Konva.Text({
                x: 10,
                y: 40,
                text: item.title,
                fontSize: 14,
                fontFamily: 'Arial',
                fontStyle: 'bold',
                fill: '#ffffff',
                width: 80,
                align: 'center'
            });
            
            // Add elements to the group
            itemGroup.add(background);
            itemGroup.add(title);
            
            return itemGroup;
        },
        onItemClick: (item, index) => {
            console.log(`Clicked on horizontal item ${item.title} at index ${index}`);
        }
    });
    
    // Create a horizontal list label
    const horizontalListLabel = new Label({
        x: 50,
        y: 280,
        width: 200,
        height: 15,
        text: 'Horizontal ListView',
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#333333'
    });
    
    // Add ListView and title to the layer
    layer.add(titleLabel);
    layer.add(verticalListView);
    layer.add(horizontalListLabel);
    layer.add(horizontalListView);
    
    // Draw layer
    layer.draw();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const container = document.getElementById('listview-demo');
        if (container) {
            stage.width(container.offsetWidth);
            stage.height(container.offsetHeight);
            layer.draw();
        }
    });
    
    return { stage, layer, verticalListView, horizontalListView };
}

// Kiểm tra các container DOM và khởi tạo demos
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo demos
    setupButtonDemo();
    setupLabelDemo();
    setupImageViewDemo();
    setupScrollViewDemo();
    setupListViewDemo();
});
