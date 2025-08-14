import React, { useState } from 'react'
import ImageModal from './ImageModal'

function ImageGallery({ images, apiBaseUrl, view, onImageDelete }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No images uploaded yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload your first image to get started</p>
      </div>
    )
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async (imageId) => {
    setDeleting(true)
    try {
      const response = await fetch(`${apiBaseUrl}/image/${imageId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        onImageDelete(imageId)
        setDeleteConfirm(null)
        setSelectedImage(null)
      } else {
        const errorText = await response.text()
        alert('삭제 실패: ' + errorText)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('삭제 중 오류가 발생했습니다')
    } finally {
      setDeleting(false)
    }
  }

  if (view === 'list') {
    return (
      <>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  ID / Filename
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Uploaded
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {images.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={`${apiBaseUrl}/image/${image.id}`}
                      alt={image.filename || image.id}
                      className="h-12 w-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedImage(image)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {image.id}
                      </div>
                      {image.filename && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {image.filename}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {image.size ? formatFileSize(image.size) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {image.uploadedAt ? formatDate(image.uploadedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            apiBaseUrl={apiBaseUrl}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={`${apiBaseUrl}/image/${image.id}`}
              alt={image.filename || image.id}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-xs font-medium truncate">{image.filename || image.id}</p>
                {image.size && (
                  <p className="text-xs opacity-90 mt-1">{formatFileSize(image.size)}</p>
                )}
              </div>
              {/* 삭제 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteConfirm(image)
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          apiBaseUrl={apiBaseUrl}
          onClose={() => setSelectedImage(null)}
        />
      )}
      
      {/* 삭제 확인 다이얼로그 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              이미지 삭제 확인
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              정말로 이 이미지를 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              ID: {deleteConfirm.id}
              {deleteConfirm.filename && (
                <>
                  <br />
                  파일명: {deleteConfirm.filename}
                </>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={deleting}
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery