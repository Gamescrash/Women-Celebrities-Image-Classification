// DOM Elements
const dropZone = document.getElementById('dropZone');
const dropZoneContent = document.getElementById('dropZoneContent');
const fileInput = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');
const imagePreview = document.getElementById('imagePreview');
const removeBtn = document.getElementById('removeBtn');
const classifyBtn = document.getElementById('classifyBtn');
const resultsBox = document.getElementById('resultsBox');
const loadingState = document.getElementById('loadingState');
const noResultState = document.getElementById('noResultState');
const resultState = document.getElementById('resultState');
const resultImage = document.getElementById('resultImage');
const resultName = document.getElementById('resultName');
const resultConfidence = document.getElementById('resultConfidence');
const resultProbabilityRows = document.getElementById('resultProbabilityRows');
const showcaseGrid = document.getElementById('showcaseGrid');
const serverStatus = document.getElementById('serverStatus');
const statusText = serverStatus.querySelector('.status-text');

// API Configuration
const API_URL = 'http://localhost:5000';

// Global Variables
let currentImageBase64 = null;
let classDictionary = {};
let celebrityImages = {}; // Store celebrity images

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadClassDictionary();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Drag & Drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('click', () => {
        if (dropZoneContent.style.display !== 'none') {
            fileInput.click();
        }
    });
    
    // File Input
    fileInput.addEventListener('change', handleFileSelect);
    
    // Remove Button
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUpload();
    });
    
    // Classify Button
    classifyBtn.addEventListener('click', classifyImage);
    
    // Prevent default drag & drop on body
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
}

// Drag & Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave() {
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
}

// File Handling
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        currentImageBase64 = e.target.result;
        imagePreview.src = e.target.result;
        
        // Show preview, hide drop zone content
        dropZoneContent.style.display = 'none';
        uploadPreview.style.display = 'flex';
        
        // Enable classify button
        classifyBtn.disabled = false;
        
        // Reset results
        showNoResultState();
    };
    
    reader.readAsDataURL(file);
}

function resetUpload() {
    currentImageBase64 = null;
    fileInput.value = '';
    
    // Show drop zone content, hide preview
    dropZoneContent.style.display = 'block';
    uploadPreview.style.display = 'none';
    
    // Disable classify button
    classifyBtn.disabled = true;
    
    // Reset results
    showNoResultState();
}

// Load Class Dictionary
async function loadClassDictionary() {
    try {
        const response = await fetch(`${API_URL}/class_dictionary`);
        if (response.ok) {
            classDictionary = await response.json();
            console.log('Available classes:', Object.keys(classDictionary));
            
            // Update server status
            serverStatus.classList.add('connected');
            statusText.textContent = 'Server connected';
            
            // Populate celebrity showcase
            populateCelebrityShowcase();
        } else {
            throw new Error('Server not available');
        }
    } catch (error) {
        console.error('Error loading classes:', error);
        serverStatus.classList.add('disconnected');
        statusText.textContent = 'Server not connected';
    }
}

// Populate Celebrity Showcase
function populateCelebrityShowcase() {
    showcaseGrid.innerHTML = '';
    
    const celebrities = Object.keys(classDictionary);
    
    // Show up to 5 celebrities
    const displayCount = Math.min(5, celebrities.length);
    
    for (let i = 0; i < displayCount; i++) {
        const celebrity = celebrities[i];
        const card = createCelebrityCard(celebrity);
        showcaseGrid.appendChild(card);
    }
}

function createCelebrityCard(name) {
    const card = document.createElement('div');
    card.className = 'celebrity-card';
    
    // Format name for display
    const displayName = formatCelebrityName(name);
    
    // Try to load celebrity image, fallback to placeholder
    const imageUrl = getCelebrityImage(name);
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=100&background=28a745&color=fff&bold=true&font-size=0.4`;
    
    console.log(`Trying to load image for ${name}: ${imageUrl}`);
    
    card.innerHTML = `
        <img src="${imageUrl}" 
             alt="${displayName}" 
             class="celebrity-avatar"
             onerror="console.warn('❌ Image not found: ${imageUrl}'); this.onerror=null; this.src='${fallbackUrl}';"
             onload="console.log('✅ Image loaded: ${imageUrl}');">
        <h3>${displayName}</h3>
    `;
    
    return card;
}

// Get celebrity image URL (you can customize this to point to your image directory)
function getCelebrityImage(name) {
    // Try to load from local images directory
    // The path is relative to the HTML file location
    const imagePath = `images/${name}.jpg`;
    
    // We'll return the path and let the img tag's onerror handle fallback
    return imagePath;
}

// Create a test function to check if image exists
function testImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// Classify Image
async function classifyImage() {
    if (!currentImageBase64) return;
    
    // Show loading state
    showLoadingState();
    
    try {
        const formData = new FormData();
        formData.append('image_data', currentImageBase64);
        
        const response = await fetch(`${API_URL}/classify_image`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const results = await response.json();
        
        if (results && results.length > 0) {
            displayResults(results[0]);
        } else {
            alert('No face detected in the image. Please ensure the image contains a visible face with both eyes.');
            showNoResultState();
        }
    } catch (error) {
        console.error('Error during classification:', error);
        alert('Error during image analysis. Make sure the Flask server is running on http://localhost:5000');
        showNoResultState();
    }
}

// Display Results
function displayResults(result) {
    const predictedClass = result.class;
    const probabilities = result.class_probability;
    const classDict = result.class_dictionary;
    
    // Create predictions array
    const predictions = [];
    for (let i = 0; i < probabilities.length; i++) {
        const className = Object.keys(classDict).find(key => classDict[key] === i);
        if (className) {
            predictions.push({
                name: className,
                probability: probabilities[i]
            });
        }
    }
    
    // Sort by probability descending
    predictions.sort((a, b) => b.probability - a.probability);
    
    // Get top prediction
    const topPrediction = predictions[0];
    
    // Display top result
    resultName.textContent = formatCelebrityName(predictedClass);
    resultConfidence.textContent = `${topPrediction.probability.toFixed(2)}% confidence`;
    
    // Show predicted celebrity image in the circle
    const predictedImageUrl = getCelebrityImage(predictedClass);
    resultImage.src = predictedImageUrl;
    resultImage.onerror = function() {
        // Fallback to uploaded image if celebrity image not found
        this.src = currentImageBase64;
    };
    
    // Display probability table with celebrity images
    resultProbabilityRows.innerHTML = '';
    predictions.forEach((pred, index) => {
        // Only show top 5
        if (index < 5) {
            const row = document.createElement('div');
            row.className = 'table-row';
            
            // Highlight the predicted class
            if (pred.name === predictedClass) {
                row.classList.add('highlight');
            }
            
            const displayName = formatCelebrityName(pred.name);
            const imageUrl = getCelebrityImage(pred.name);
            
            row.innerHTML = `
                <img src="${imageUrl}" 
                     alt="${displayName}" 
                     class="celebrity-avatar-small"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=40&background=28a745&color=fff&bold=true&font-size=0.4'">
                <span>${displayName}</span>
                <span>${pred.probability.toFixed(2)}%</span>
            `;
            
            resultProbabilityRows.appendChild(row);
        }
    });
    
    // Show result state
    showResultState();
}

// State Management
function showLoadingState() {
    noResultState.style.display = 'none';
    resultState.style.display = 'none';
    loadingState.style.display = 'block';
}

function showNoResultState() {
    loadingState.style.display = 'none';
    resultState.style.display = 'none';
    noResultState.style.display = 'block';
}

function showResultState() {
    loadingState.style.display = 'none';
    noResultState.style.display = 'none';
    resultState.style.display = 'block';
}

// Utility Functions
function formatCelebrityName(name) {
    return name
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}
