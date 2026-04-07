// 获取页面元素
const styleSelect = document.getElementById('styleSelect');
const dressDisplay = document.getElementById('dressDisplay');
const necklineGroup = document.getElementById('necklineGroup');
const sleeveGroup = document.getElementById('sleeveGroup');
const colorOptions = document.querySelectorAll('.color-option');
const submitBtn = document.getElementById('submitBtn');

// 存储当前选择
let currentNeckline = 'V领';
let currentSleeve = '无袖';
let currentColor = '#FFF5EE';

// ----- 1. 更新左侧文字预览 -----
function updatePreviewText() {
    const style = styleSelect.value;
    dressDisplay.innerHTML = `${style}<br><span>${currentNeckline} + ${currentSleeve}<br>🎨 ${getColorName(currentColor)}</span>`;
}

function getColorName(hex) {
    const map = {
        '#FFF5EE': '纯白',
        '#FAEBD7': '象牙白',
        '#F3E5D8': '香槟色',
        '#FFD1DC': '浅粉色'
    };
    return map[hex] || '定制色';
}

// ----- 2. 领口按钮 -----
necklineGroup.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        necklineGroup.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentNeckline = btn.getAttribute('data-value');
        updatePreviewText();
    });
});
necklineGroup.querySelector('button').classList.add('active');

// ----- 3. 袖型按钮 -----
sleeveGroup.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        sleeveGroup.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSleeve = btn.getAttribute('data-value');
        updatePreviewText();
    });
});
sleeveGroup.querySelector('button').classList.add('active');

// ----- 4. 颜色选择 -----
colorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
        colorOptions.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        currentColor = opt.getAttribute('data-color');
        dressDisplay.style.backgroundColor = currentColor;
        updatePreviewText();
    });
});
colorOptions[0].classList.add('selected');
dressDisplay.style.backgroundColor = '#FFF5EE';

styleSelect.addEventListener('change', updatePreviewText);
updatePreviewText();

// ========= 图片上传功能 =========
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('inspireImage');
const uploadBtn = document.getElementById('uploadBtn');
const previewContainer = document.getElementById('imagePreviewContainer');

let selectedFiles = [];

if (uploadArea) {
    uploadArea.addEventListener('click', (e) => {
        if (e.target !== uploadBtn) {
            fileInput.click();
        }
    });
}

uploadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#b46f4a';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#dcc7ae';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#dcc7ae';
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addFiles(files);
});

function addFiles(files) {
    const remainingSlots = 5 - selectedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length === 0) {
        alert('最多只能上传5张参考图片');
        return;
    }
    
    filesToAdd.forEach(file => {
        if (file.type.startsWith('image/')) {
            selectedFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                createPreviewItem(e.target.result, file.name, selectedFiles.length - 1);
            };
            reader.readAsDataURL(file);
        }
    });
    fileInput.value = '';
}

function createPreviewItem(imageUrl, fileName, index) {
    const previewDiv = document.createElement('div');
    previewDiv.className = 'preview-item';
    previewDiv.setAttribute('data-index', index);
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = fileName;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-image';
    removeBtn.innerHTML = '✕';
    removeBtn.onclick = () => {
        const idx = parseInt(previewDiv.getAttribute('data-index'));
        selectedFiles.splice(idx, 1);
        previewDiv.remove();
        document.querySelectorAll('.preview-item').forEach((item, newIdx) => {
            item.setAttribute('data-index', newIdx);
        });
    };
    
    previewDiv.appendChild(img);
    previewDiv.appendChild(removeBtn);
    previewContainer.appendChild(previewDiv);
}

// ========= 提交按钮 =========
submitBtn.addEventListener('click', () => {
    const style = styleSelect.value;
    const neckline = currentNeckline;
    const sleeve = currentSleeve;
    const colorName = getColorName(currentColor);
    const bust = document.getElementById('bust').value || '未填';
    const waist = document.getElementById('waist').value || '未填';
    const hip = document.getElementById('hip').value || '未填';
    const height = document.getElementById('height').value || '未填';
    const special = document.getElementById('specialRequest').value || '无';
    
    let imageInfo = '未上传';
    if (selectedFiles.length > 0) {
        imageInfo = `已上传 ${selectedFiles.length} 张参考图片：\n`;
        selectedFiles.forEach((f, i) => {
            imageInfo += `  ${i+1}. ${f.name}\n`;
        });
    }
    
    const orderInfo = `
✨ 婚纱定制需求单 ✨
------------------------
👗 款式：${style}
💎 领口：${neckline}
🧵 袖型：${sleeve}
🎨 颜色：${colorName}
📏 尺寸：胸围 ${bust} / 腰围 ${waist} / 臀围 ${hip} / 身高 ${height}
📸 参考图片：${imageInfo}
💌 补充说明：${special}
------------------------
📞 我们将根据您上传的图片进行1:1定制生产，客服将在24小时内联系您
    `;
    
    alert(orderInfo);
    console.log('定制数据：', {
        style, neckline, sleeve, colorName,
        bust, waist, hip, height,
        special,
        images: selectedFiles.map(f => ({ name: f.name, size: f.size }))
    });
});