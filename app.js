// API 설정
let API_BASE_URL = localStorage.getItem('apiUrl') || 'http://localhost:5787';
document.getElementById('apiUrl').textContent = API_BASE_URL;

// 상태 관리
const state = {
    images: [],
    filteredImages: [],
    currentPage: 1,
    itemsPerPage: 12,
    viewMode: 'grid',
    sortBy: 'date-desc',
    searchTags: [],
    allTags: [],
    stats: {
        totalImages: 0,
        totalSize: 0,
        totalTags: 0,
        todayUploads: 0
    }
};

// DOM 요소
const elements = {
    gallery: document.getElementById('gallery'),
    loading: document.getElementById('loading'),
    emptyState: document.getElementById('emptyState'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    sortBy: document.getElementById('sortBy'),
    pagination: document.getElementById('pagination'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    modal: document.getElementById('imageModal'),
    toast: document.getElementById('toast'),
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('fileInput'),
    tagCloud: document.getElementById('tagsContainer')
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadImages();
    loadTags();
    updateStats();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 검색
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.clearSearchBtn.addEventListener('click', clearSearch);
    
    // 정렬
    elements.sortBy.addEventListener('change', handleSort);
    
    // 페이지네이션
    elements.prevBtn.addEventListener('click', () => changePage(-1));
    elements.nextBtn.addEventListener('click', () => changePage(1));
    
    // 뷰 모드 전환
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => changeViewMode(btn.dataset.view));
    });
    
    // 업로드 탭 전환
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchUploadTab(btn.dataset.tab));
    });
    
    // 파일 업로드
    elements.dropZone.addEventListener('click', () => elements.fileInput.click());
    elements.dropZone.addEventListener('dragover', handleDragOver);
    elements.dropZone.addEventListener('drop', handleDrop);
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // URL 업로드
    document.getElementById('uploadUrlBtn').addEventListener('click', handleUrlUpload);
    
    // 모달 닫기
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });
    
    // API URL 변경
    document.getElementById('changeApiBtn').addEventListener('click', changeApiUrl);
}

// 이미지 목록 로드
async function loadImages() {
    showLoading(true);
    
    try {
        // 태그 검색 API 사용
        let url = `${API_BASE_URL}/images/search?tags=&limit=1000`; // 모든 이미지 조회
        
        if (state.searchTags.length > 0) {
            url = `${API_BASE_URL}/images/search?tags=${state.searchTags.join(',')}&operator=OR`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('이미지 목록을 불러올 수 없습니다');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            state.images = data.data.images || [];
            state.filteredImages = [...state.images];
            sortImages();
            renderGallery();
            updatePagination();
        }
        
    } catch (error) {
        console.error('이미지 로드 실패:', error);
        showToast('이미지를 불러오는데 실패했습니다', 'error');
        
        // 대체 방법: 개별 이미지 로드 시도
        await loadImagesAlternative();
    } finally {
        showLoading(false);
    }
}

// 대체 이미지 로드 방법 (메타데이터 직접 조회)
async function loadImagesAlternative() {
    // API가 전체 목록을 제공하지 않는 경우
    // 로컬 스토리지에 저장된 이미지 ID들을 사용하거나
    // 알려진 이미지 ID 범위를 스캔
    
    const savedImageIds = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
    
    if (savedImageIds.length > 0) {
        const images = [];
        
        for (const id of savedImageIds) {
            try {
                const response = await fetch(`${API_BASE_URL}/image/${id}/metadata`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        images.push({
                            id: id,
                            url: `${API_BASE_URL}/image/${id}`,
                            ...data.data
                        });
                    }
                }
            } catch (error) {
                console.error(`이미지 ${id} 로드 실패:`, error);
            }
        }
        
        state.images = images;
        state.filteredImages = [...images];
        sortImages();
        renderGallery();
        updatePagination();
    }
}

// 태그 목록 로드
async function loadTags() {
    try {
        const response = await fetch(`${API_BASE_URL}/tags?sort=count&order=desc&limit=20`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                state.allTags = data.data.tags || [];
                renderTagCloud();
            }
        }
    } catch (error) {
        console.error('태그 로드 실패:', error);
    }
}

// 통계 업데이트
async function updateStats() {
    // 전체 이미지 수
    document.getElementById('totalImages').textContent = state.images.length;
    
    // 총 용량 계산
    const totalSize = state.images.reduce((sum, img) => sum + (img.size || 0), 0);
    document.getElementById('totalSize').textContent = formatBytes(totalSize);
    
    // 태그 수
    document.getElementById('totalTags').textContent = state.allTags.length;
    
    // 오늘 업로드 수
    const today = new Date().toDateString();
    const todayUploads = state.images.filter(img => {
        const uploadDate = new Date(img.uploadDate || img.uploadedAt);
        return uploadDate.toDateString() === today;
    }).length;
    document.getElementById('todayUploads').textContent = todayUploads;
}

// 갤러리 렌더링
function renderGallery() {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const pageImages = state.filteredImages.slice(start, end);
    
    if (pageImages.length === 0) {
        elements.gallery.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
        return;
    }
    
    elements.gallery.classList.remove('hidden');
    elements.emptyState.classList.add('hidden');
    
    elements.gallery.innerHTML = pageImages.map(image => {
        const imageUrl = image.url || `${API_BASE_URL}/image/${image.id}`;
        const thumbnailUrl = `${imageUrl}?w=400&h=300&fit=cover`;
        
        return `
            <div class="gallery-item" data-id="${image.id}">
                <div class="image-wrapper">
                    <img src="${thumbnailUrl}" alt="${image.originalName || 'Image'}" loading="lazy">
                    <div class="image-overlay">
                        <button class="view-btn" onclick="viewImage('${image.id}')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="image-info">
                    <p class="image-name">${image.originalName || 'Untitled'}</p>
                    <p class="image-meta">${formatBytes(image.size || 0)} • ${formatDate(image.uploadDate)}</p>
                    ${image.tags && image.tags.length > 0 ? `
                        <div class="image-tags">
                            ${image.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                            ${image.tags.length > 3 ? `<span class="tag">+${image.tags.length - 3}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// 태그 클라우드 렌더링
function renderTagCloud() {
    if (state.allTags.length === 0) {
        elements.tagCloud.innerHTML = '<p class="no-tags">태그가 없습니다</p>';
        return;
    }
    
    const maxCount = Math.max(...state.allTags.map(t => t.count));
    
    elements.tagCloud.innerHTML = state.allTags.map(tag => {
        const size = 0.8 + (tag.count / maxCount) * 0.8; // 0.8em ~ 1.6em
        return `
            <span class="tag-cloud-item" 
                  style="font-size: ${size}em" 
                  onclick="searchByTag('${tag.name}')"
                  title="${tag.count}개 이미지">
                ${tag.name}
            </span>
        `;
    }).join('');
}

// 이미지 상세 보기
async function viewImage(imageId) {
    const image = state.images.find(img => img.id === imageId);
    if (!image) return;
    
    // 모달 열기
    elements.modal.classList.remove('hidden');
    
    // 이미지 표시
    const imageUrl = image.url || `${API_BASE_URL}/image/${imageId}`;
    document.getElementById('modalImage').src = imageUrl;
    
    // 정보 표시
    document.getElementById('modalId').textContent = imageId;
    document.getElementById('modalName').textContent = image.originalName || 'Untitled';
    document.getElementById('modalSize').textContent = formatBytes(image.size || 0);
    document.getElementById('modalType').textContent = image.contentType || 'Unknown';
    document.getElementById('modalDate').textContent = formatDate(image.uploadDate);
    document.getElementById('modalExif').textContent = image.hasExif ? '있음' : '없음';
    document.getElementById('imageUrlField').value = imageUrl;
    
    // 태그 표시
    if (image.tags && image.tags.length > 0) {
        document.getElementById('modalTags').innerHTML = image.tags.map(tag => 
            `<span class="tag removable" onclick="removeTag('${imageId}', '${tag}')">${tag} ×</span>`
        ).join('');
    } else {
        document.getElementById('modalTags').innerHTML = '<span class="no-tags">태그 없음</span>';
    }
    
    // 액션 버튼 이벤트
    document.getElementById('copyUrlBtn').onclick = () => copyToClipboard(imageUrl);
    document.getElementById('downloadBtn').onclick = () => downloadImage(imageUrl, image.originalName);
    document.getElementById('deleteBtn').onclick = () => deleteImage(imageId);
    document.getElementById('addTagBtn').onclick = () => addTag(imageId);
    
    // 추가 메타데이터 로드
    loadImageMetadata(imageId);
}

// 이미지 메타데이터 로드
async function loadImageMetadata(imageId) {
    try {
        const response = await fetch(`${API_BASE_URL}/image/${imageId}/metadata`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                // 추가 정보 업데이트
                if (data.data.originalUrl) {
                    // 원본 URL이 있으면 표시
                    const infoGrid = document.querySelector('.info-grid');
                    if (!document.getElementById('modalOriginalUrl')) {
                        const originalUrlItem = document.createElement('div');
                        originalUrlItem.className = 'info-item';
                        originalUrlItem.innerHTML = `
                            <span class="info-label">원본 URL:</span>
                            <span id="modalOriginalUrl" class="info-value">
                                <a href="${data.data.originalUrl}" target="_blank">보기</a>
                            </span>
                        `;
                        infoGrid.appendChild(originalUrlItem);
                    }
                }
            }
        }
    } catch (error) {
        console.error('메타데이터 로드 실패:', error);
    }
}

// 파일 업로드 처리
async function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    const tags = document.getElementById('fileTags').value;
    const compress = document.getElementById('compressFile').checked;
    
    for (const file of files) {
        await uploadFile(file, tags, compress);
    }
    
    // 입력 초기화
    event.target.value = '';
    document.getElementById('fileTags').value = '';
    
    // 갤러리 새로고침
    setTimeout(() => {
        loadImages();
        loadTags();
        updateStats();
    }, 1000);
}

// 파일 업로드
async function uploadFile(file, tags, compress) {
    const formData = new FormData();
    formData.append('image', file);
    if (tags) {
        formData.append('tags', tags);
    }
    
    let url = `${API_BASE_URL}/upload`;
    if (compress) {
        url += '?compress=true&quality=85';
    }
    
    showToast(`${file.name} 업로드 중...`, 'info');
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showToast(`${file.name} 업로드 완료!`, 'success');
            
            // 업로드된 이미지 ID 저장
            const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
            uploadedImages.push(data.data.id);
            localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
            
            return data.data;
        } else {
            throw new Error(data.error || '업로드 실패');
        }
    } catch (error) {
        showToast(`${file.name} 업로드 실패: ${error.message}`, 'error');
        console.error('업로드 오류:', error);
    }
}

// URL 업로드 처리
async function handleUrlUpload() {
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const tags = document.getElementById('urlTags').value;
    const compress = document.getElementById('compressUrl').checked;
    
    if (!imageUrl) {
        showToast('이미지 URL을 입력해주세요', 'error');
        return;
    }
    
    let apiUrl = `${API_BASE_URL}/upload-from-url`;
    if (compress) {
        apiUrl += '?compress=true&quality=85';
    }
    
    showToast('URL에서 이미지 다운로드 중...', 'info');
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                tags: tags ? tags.split(',').map(t => t.trim()) : []
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showToast('이미지 업로드 완료!', 'success');
            
            // 업로드된 이미지 ID 저장
            const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
            uploadedImages.push(data.data.id);
            localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
            
            // 입력 초기화
            document.getElementById('imageUrl').value = '';
            document.getElementById('urlTags').value = '';
            
            // 갤러리 새로고침
            setTimeout(() => {
                loadImages();
                loadTags();
                updateStats();
            }, 1000);
            
        } else {
            throw new Error(data.error || '업로드 실패');
        }
    } catch (error) {
        showToast(`업로드 실패: ${error.message}`, 'error');
        console.error('URL 업로드 오류:', error);
    }
}

// 드래그 앤 드롭 처리
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.dropZone.classList.add('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        elements.fileInput.files = files;
        handleFileSelect({ target: { files } });
    }
}

// 검색 처리
function handleSearch() {
    const searchText = elements.searchInput.value.trim();
    if (!searchText) {
        clearSearch();
        return;
    }
    
    state.searchTags = searchText.split(',').map(t => t.trim()).filter(t => t);
    state.currentPage = 1;
    loadImages();
}

// 태그로 검색
function searchByTag(tag) {
    elements.searchInput.value = tag;
    handleSearch();
}

// 검색 초기화
function clearSearch() {
    elements.searchInput.value = '';
    state.searchTags = [];
    state.currentPage = 1;
    loadImages();
}

// 정렬 처리
function handleSort() {
    state.sortBy = elements.sortBy.value;
    sortImages();
    renderGallery();
}

function sortImages() {
    const [field, order] = state.sortBy.split('-');
    
    state.filteredImages.sort((a, b) => {
        let valueA, valueB;
        
        switch (field) {
            case 'date':
                valueA = new Date(a.uploadDate || 0);
                valueB = new Date(b.uploadDate || 0);
                break;
            case 'size':
                valueA = a.size || 0;
                valueB = b.size || 0;
                break;
            case 'name':
                valueA = (a.originalName || '').toLowerCase();
                valueB = (b.originalName || '').toLowerCase();
                break;
        }
        
        if (order === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}

// 페이지네이션
function changePage(direction) {
    const totalPages = Math.ceil(state.filteredImages.length / state.itemsPerPage);
    const newPage = state.currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        state.currentPage = newPage;
        renderGallery();
        updatePagination();
        window.scrollTo(0, 0);
    }
}

function updatePagination() {
    const totalPages = Math.ceil(state.filteredImages.length / state.itemsPerPage);
    
    elements.pageInfo.textContent = `${state.currentPage} / ${totalPages}`;
    elements.prevBtn.disabled = state.currentPage === 1;
    elements.nextBtn.disabled = state.currentPage === totalPages;
}

// 뷰 모드 변경
function changeViewMode(mode) {
    state.viewMode = mode;
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === mode);
    });
    
    elements.gallery.className = `gallery ${mode}-view`;
}

// 업로드 탭 전환
function switchUploadTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    document.getElementById('fileUpload').classList.toggle('hidden', tab !== 'file');
    document.getElementById('urlUpload').classList.toggle('hidden', tab !== 'url');
}

// 모달 닫기
function closeModal() {
    elements.modal.classList.add('hidden');
}

// 유틸리티 함수들
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
}

function showLoading(show) {
    elements.loading.classList.toggle('hidden', !show);
}

function showToast(message, type = 'info') {
    const toast = elements.toast;
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('URL이 클립보드에 복사되었습니다', 'success');
    }).catch(() => {
        showToast('복사 실패', 'error');
    });
}

function downloadImage(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'image';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('다운로드 시작', 'success');
}

async function deleteImage(imageId) {
    if (!confirm('정말로 이 이미지를 삭제하시겠습니까?')) return;
    
    const deleteKey = prompt('삭제 키를 입력하세요:');
    if (!deleteKey) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/image/${imageId}`, {
            method: 'DELETE',
            headers: {
                'X-Delete-Key': deleteKey
            }
        });
        
        if (response.ok) {
            showToast('이미지가 삭제되었습니다', 'success');
            closeModal();
            
            // 로컬 스토리지에서 제거
            const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages') || '[]');
            const index = uploadedImages.indexOf(imageId);
            if (index > -1) {
                uploadedImages.splice(index, 1);
                localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
            }
            
            // 갤러리 새로고침
            loadImages();
            updateStats();
        } else {
            const data = await response.json();
            throw new Error(data.error || '삭제 실패');
        }
    } catch (error) {
        showToast(`삭제 실패: ${error.message}`, 'error');
    }
}

async function addTag(imageId) {
    const newTag = document.getElementById('newTag').value.trim();
    if (!newTag) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/image/${imageId}/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tags: [newTag] })
        });
        
        if (response.ok) {
            showToast('태그가 추가되었습니다', 'success');
            document.getElementById('newTag').value = '';
            
            // 이미지 정보 업데이트
            const image = state.images.find(img => img.id === imageId);
            if (image) {
                if (!image.tags) image.tags = [];
                if (!image.tags.includes(newTag)) {
                    image.tags.push(newTag);
                }
            }
            
            // 태그 목록 새로고침
            viewImage(imageId);
            loadTags();
        } else {
            throw new Error('태그 추가 실패');
        }
    } catch (error) {
        showToast(`태그 추가 실패: ${error.message}`, 'error');
    }
}

async function removeTag(imageId, tag) {
    if (!confirm(`"${tag}" 태그를 삭제하시겠습니까?`)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/image/${imageId}/tags`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tags: [tag] })
        });
        
        if (response.ok) {
            showToast('태그가 삭제되었습니다', 'success');
            
            // 이미지 정보 업데이트
            const image = state.images.find(img => img.id === imageId);
            if (image && image.tags) {
                const index = image.tags.indexOf(tag);
                if (index > -1) {
                    image.tags.splice(index, 1);
                }
            }
            
            // 태그 목록 새로고침
            viewImage(imageId);
            loadTags();
        } else {
            throw new Error('태그 삭제 실패');
        }
    } catch (error) {
        showToast(`태그 삭제 실패: ${error.message}`, 'error');
    }
}

function changeApiUrl() {
    const newUrl = prompt('새 API URL을 입력하세요:', API_BASE_URL);
    if (newUrl && newUrl !== API_BASE_URL) {
        API_BASE_URL = newUrl;
        localStorage.setItem('apiUrl', newUrl);
        document.getElementById('apiUrl').textContent = newUrl;
        
        // 갤러리 새로고침
        loadImages();
        loadTags();
        updateStats();
        
        showToast('API URL이 변경되었습니다', 'success');
    }
}