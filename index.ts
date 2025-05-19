// Import Konva và UI Components
import Konva from 'konva';
import { Button } from './src/components/Button';

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

// Setup demos khi trang đã load
document.addEventListener('DOMContentLoaded', () => {
    setupButtonDemo();
});
