// Import Konva và UI Components
import Konva from 'konva';
import { Button } from './src/components/Button';
import { Label } from './src/components/Label';

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
        hoverColor: '#2980b9',
        activeColor: '#1c638d',
        cornerRadius: 6
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
        hoverColor: '#c0392b',
        activeColor: '#922b21',
        cornerRadius: 20,
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
        hoverColor: '#f8f9fa',
        activeColor: '#e9ecef',
        cornerRadius: 4,
        borderWidth: 2,
        borderColor: '#2ecc71',
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
        hoverColor: '#8e44ad',
        activeColor: '#6c3483',
        cornerRadius: 8,
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
        hoverColor: '#f39c12',
        activeColor: '#d68910',
        cornerRadius: 0,
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
        cornerRadius: 4,
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
        cornerRadius: 4
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
        cornerRadius: 4
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
        cornerRadius: 20
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
        cornerRadius: 4
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
        cornerRadius: 4,
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

// Kiểm tra các container DOM và khởi tạo demos
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo demos
    setupButtonDemo();
    setupLabelDemo();
});
