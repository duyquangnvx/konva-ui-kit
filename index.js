// Import Konva và UI Kit
import Konva from 'konva';
import * as UIKit from './src';

// Khởi tạo các stage và layer cho từng demo container
function createStageAndLayer(containerId) {
	const container = document.getElementById(containerId);
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
	const basicButton = new UIKit.Button({
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
	const roundedButton = new UIKit.Button({
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
	const borderedButton = new UIKit.Button({
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
	const largeButton = new UIKit.Button({
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
	const textButton = new UIKit.Button({
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
	basicButton.render(layer);
	roundedButton.render(layer);
	borderedButton.render(layer);
	largeButton.render(layer);
	textButton.render(layer);
	
	layer.draw();
	
	return { stage, layer, buttons: [basicButton, roundedButton, borderedButton, largeButton, textButton] };
}

// ===== ImageView Demo =====
function setupImageViewDemo() {
	const { stage, layer } = createStageAndLayer('imageview-demo');
	
	// Tạo các ImageView với các chế độ khác nhau
	
	// Image với chế độ contain
	const imageContain = new UIKit.ImageView({
		x: 50,
		y: 50,
		width: 150,
		height: 150,
		image: 'https://konvajs.org/assets/lion.png',
		showBackground: true,
		backgroundColor: '#f0f0f0',
		objectFit: 'contain',
		backgroundCornerRadius: 6
	});
	
	// Image với chế độ cover
	const imageCover = new UIKit.ImageView({
		x: 250,
		y: 50,
		width: 150,
		height: 150,
		image: 'https://konvajs.org/assets/lion.png',
		showBackground: true,
		backgroundColor: '#f0f0f0',
		objectFit: 'cover',
		backgroundCornerRadius: 0
	});
	
	// Image với chế độ fill
	const imageFill = new UIKit.ImageView({
		x: 450,
		y: 50,
		width: 150,
		height: 150,
		image: 'https://konvajs.org/assets/lion.png',
		showBackground: true,
		backgroundColor: '#f0f0f0',
		objectFit: 'fill',
		backgroundCornerRadius: 0
	});
	
	// Thêm image view không có hình ảnh, chỉ có background
	const imageNoImage = new UIKit.ImageView({
		x: 650,
		y: 50,
		width: 150,
		height: 150,
		showBackground: true,
		backgroundColor: '#e0e0e0',
		backgroundCornerRadius: 8,
		borderWidth: 2,
		borderColor: '#aaaaaa'
	});
	
	// Tạo các labels
	function createLabel(text, x, y) {
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
	const noImageLabel = createLabel('No image, only background', 650, 210);
	
	// Add to layer
	imageContain.render(layer);
	imageCover.render(layer);
	imageFill.render(layer);
	imageNoImage.render(layer);
	
	layer.add(containLabel);
	layer.add(coverLabel);
	layer.add(fillLabel);
	layer.add(noImageLabel);
	
	layer.draw();
	
	return { stage, layer, images: [imageContain, imageCover, imageFill, imageNoImage] };
}

// ===== ScrollView Demo =====
function setupScrollViewDemo() {
	const { stage, layer } = createStageAndLayer('scrollview-demo');
	
	// Đảm bảo rằng layer được render trước
	layer.draw();
	
	// Create ScrollView
	const scrollView = new UIKit.ScrollView({
		x: 50,
		y: 50,
		width: 300,
		height: 250,
		backgroundColor: '#f9f9f9',
		scrollbarColor: '#888888',
		scrollbarWidth: 8,
		scrollbarCornerRadius: 4
	});
	
	// Add content to ScrollView
	let yPosition = 10;
	const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#d35400', '#34495e'];
	
	for (let i = 0; i < 15; i++) {
		const colorIndex = i % colors.length;
		
		// Tạo màu tối hơn thay vì sử dụng Konva.Util.darker
		const darkenColor = (hex, percent) => {
			// Chuyển hex sang RGB
			let r = parseInt(hex.slice(1, 3), 16);
			let g = parseInt(hex.slice(3, 5), 16);
			let b = parseInt(hex.slice(5, 7), 16);
			
			// Làm tối màu theo phần trăm
			r = Math.max(0, Math.floor(r * (1 - percent)));
			g = Math.max(0, Math.floor(g * (1 - percent)));
			b = Math.max(0, Math.floor(b * (1 - percent)));
			
			// Chuyển trở lại dạng hex
			return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
		};
		
		const contentItem = new UIKit.Button({
			x: 10,
			y: yPosition,
			width: 260,
			height: 50,
			text: `Scrollable Item ${i + 1}`,
			backgroundColor: colors[colorIndex],
			hoverColor: darkenColor(colors[colorIndex], 0.3),
			cornerRadius: 4,
			fontColor: '#ffffff'
		});
		
		scrollView.addChild(contentItem);
		yPosition += 60; // 50px height + 10px spacing
	}
	
	// Update content size
	scrollView.setContentSize(300, yPosition);
	
	// Label
	const label = new Konva.Text({
		x: 50,
		y: 20,
		text: 'ScrollView (drag to scroll)',
		fontSize: 16,
		fontFamily: 'Arial',
		fill: '#333333'
	});
	
	// Add to layer
	layer.add(label);
	scrollView.render(layer);
	
	// Gọi draw một lần nữa để đảm bảo layer được cập nhật đầy đủ
	layer.draw();
	
	return { stage, layer, scrollView };
}

// ===== ListView Demo =====
function setupListViewDemo() {
	const { stage, layer } = createStageAndLayer('listview-demo');
	
	// Đảm bảo rằng layer được render trước
	layer.draw();
	
	// Create ListView
	const listView = new UIKit.ListView({
		x: 50,
		y: 50,
		width: 300,
		height: 250,
		backgroundColor: '#f9f9f9',
		scrollbarColor: '#888888',
		itemSpacing: 5,
		items: Array.from({ length: 20 }, (_, i) => ({
			id: i,
			title: `List Item ${i + 1}`,
			description: `This is item number ${i + 1}`,
			color: i % 2 === 0 ? '#27ae60' : '#2ecc71'
		})),
		renderItem: (item, index) => {
			const itemContainer = new UIKit.Component({
				width: 280,
				height: 70,
				interactive: true  // Đảm bảo component có thể tương tác
			});
			
			// Tạo nền item
			const background = new Konva.Rect({
				width: 280,
				height: 70,
				fill: item.color,
				cornerRadius: 4
			});
			
			// Tạo tiêu đề
			const title = new Konva.Text({
				x: 10,
				y: 15,
				text: item.title,
				fontSize: 16,
				fontFamily: 'Arial',
				fontStyle: 'bold',
				fill: '#ffffff'
			});
			
			// Tạo mô tả
			const description = new Konva.Text({
				x: 10,
				y: 40,
				text: item.description,
				fontSize: 14,
				fontFamily: 'Arial',
				fill: '#ffffff'
			});
			
			itemContainer.node = new Konva.Group({
				width: 280,
				height: 70
			});
			
			itemContainer.node.add(background);
			itemContainer.node.add(title);
			itemContainer.node.add(description);
			
			return itemContainer;
		},
		onItemClick: (item) => {
			console.log('List item clicked:', item);
			alert(`Đã click vào item: ${item.title}`);
		}
	});
	
	// Label
	const label = new Konva.Text({
		x: 50,
		y: 20,
		text: 'ListView (with custom item renderer)',
		fontSize: 16,
		fontFamily: 'Arial',
		fill: '#333333'
	});
	
	// Add to layer
	layer.add(label);
	listView.render(layer);
	
	// Gọi draw một lần nữa để đảm bảo layer được cập nhật đầy đủ
	layer.draw();
	
	return { stage, layer, listView };
}

// ===== Label Demo =====
function setupLabelDemo() {
	const { stage, layer } = createStageAndLayer('label-demo');
	
	// Basic label
	const basicLabel = new UIKit.Label({
		x: 50,
		y: 50,
		width: 200,
		height: 40,
		text: 'Basic Label',
		fontSize: 16,
		fill: '#333333'
	});
	
	// Label with background
	const bgLabel = new UIKit.Label({
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
	const styledLabel = new UIKit.Label({
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
	const ellipsisLabel = new UIKit.Label({
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
	const rightAlignedLabel = new UIKit.Label({
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
	const centeredLabel = new UIKit.Label({
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
	const autoSizedLabel = new UIKit.Label({
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
	autoSizedLabel.resizeToFitText(20, 10);
	
	// Section title
	const sectionLabel = new UIKit.Label({
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
		cornerRadius: 4
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
	
	labels.forEach(label => label.render(layer));
	
	layer.draw();
	
	return { stage, layer, labels };
}

// Kiểm tra sự tồn tại của các container DOM
document.addEventListener('DOMContentLoaded', () => {
	// Kiểm tra và tạo các container nếu chưa tồn tại
	['button-demo', 'imageview-demo', 'scrollview-demo', 'listview-demo', 'label-demo'].forEach(containerId => {
		if (!document.getElementById(containerId)) {
			console.error(`Container with id "${containerId}" not found. Creating a placeholder.`);
			const container = document.createElement('div');
			container.id = containerId;
			container.style.width = '100%';
			container.style.height = '400px';
			container.style.border = '1px solid #ccc';
			container.style.margin = '20px 0';
			document.body.appendChild(container);
		}
	});
	
	// Khởi tạo tất cả các demo
	const buttonDemo = setupButtonDemo();
	const imageViewDemo = setupImageViewDemo();
	const scrollViewDemo = setupScrollViewDemo();
	const listViewDemo = setupListViewDemo();
	const labelDemo = setupLabelDemo();
	
	// Xử lý sự kiện resize cửa sổ
	window.addEventListener('resize', () => {
		// Cập nhật kích thước và vị trí các stage
		['button-demo', 'imageview-demo', 'scrollview-demo', 'listview-demo', 'label-demo'].forEach(containerId => {
			const container = document.getElementById(containerId);
			const stage = Konva.stages.find(s => s.container().id === containerId);
			
			if (stage) {
				stage.width(container.offsetWidth);
				stage.height(container.offsetHeight);
			}
		});
	});
	
	// Animation loop
	const animate = () => {
		requestAnimationFrame(animate);
		
		// Update tất cả các components
		const allComponents = [
			...buttonDemo.buttons,
			...imageViewDemo.images,
			scrollViewDemo.scrollView,
			listViewDemo.listView,
			...labelDemo.labels
		];
		
		allComponents.forEach(component => {
			component.update();
		});
		
		// Draw tất cả các layer
		buttonDemo.layer.draw();
		imageViewDemo.layer.draw();
		scrollViewDemo.layer.draw();
		listViewDemo.layer.draw();
		labelDemo.layer.draw();
	};
	
	// Bắt đầu animation loop
	animate();
}); 