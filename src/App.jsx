import React, { useState, useEffect } from 'react'
import ImageGallery from './components/ImageGallery'
import ImageUploader from './components/ImageUploader'
import SearchBar from './components/SearchBar'

const API_BASE_URL = '/api'

function App() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('grid') // grid or list

  const fetchImages = async () => {
    setLoading(true)
    try {
      // API가 모든 이미지를 가져오는 엔드포인트가 없으므로
      // 빈 목록으로 시작하고, 사용자가 업로드한 이미지만 표시합니다
      // 또는 localStorage에서 이전에 업로드한 이미지 ID들을 가져올 수 있습니다
      
      const savedImageIds = localStorage.getItem('uploadedImages')
      if (savedImageIds) {
        const imageIds = JSON.parse(savedImageIds)
        const loadedImages = []
        
        // 저장된 이미지 ID들로 이미지 정보를 재구성
        for (const id of imageIds) {
          loadedImages.push({ id, filename: `image-${id}` })
        }
        
        setImages(loadedImages)
      } else {
        setImages([])
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleUploadSuccess = (newImage) => {
    if (newImage && newImage.id) {
      // 새로 업로드된 이미지를 목록에 즉시 추가
      setImages(prevImages => {
        const updatedImages = [newImage, ...prevImages]
        
        // localStorage에 이미지 ID 저장
        const imageIds = updatedImages.map(img => img.id)
        localStorage.setItem('uploadedImages', JSON.stringify(imageIds))
        
        return updatedImages
      })
    } else {
      // 전체 목록 새로고침
      fetchImages()
    }
  }

  const filteredImages = images.filter(image => 
    image.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.filename && image.filename.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Image Gallery</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'grid' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${
                  view === 'list' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ImageUploader 
              apiBaseUrl={API_BASE_URL} 
              onUploadSuccess={handleUploadSuccess} 
            />
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Images
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ImageGallery 
              images={filteredImages} 
              apiBaseUrl={API_BASE_URL}
              view={view}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App