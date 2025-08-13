import React, { useState } from 'react'

function UploadResult({ imageData, apiBaseUrl, onClose }) {
  const [copied, setCopied] = useState(false)
  
  if (!imageData) return null

  const imageUrl = `${window.location.origin}/api/image/${imageData.id}`
  const directUrl = `http://localhost:5787/image/${imageData.id}`
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              ✅ 업로드 완료!
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image Preview */}
          <div className="mb-4">
            <img
              src={imageUrl}
              alt={imageData.filename}
              className="w-full h-auto max-h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-700"
              onError={(e) => {
                e.target.src = directUrl
              }}
            />
          </div>

          {/* Image Info */}
          <div className="space-y-3 mb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">이미지 ID</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">{imageData.id}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">파일명</p>
              <p className="text-sm text-gray-900 dark:text-white">{imageData.filename || 'uploaded-image'}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">파일 크기</p>
              <p className="text-sm text-gray-900 dark:text-white">
                원본: {formatFileSize(imageData.originalSize || imageData.size)}
                {imageData.compressedSize && (
                  <span className="ml-2 text-green-600 dark:text-green-400">
                    → 압축: {formatFileSize(imageData.compressedSize)} 
                    ({Math.round((1 - imageData.compressedSize / (imageData.originalSize || imageData.size)) * 100)}% 절감)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* URL Copy Section */}
          <div className="space-y-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">이미지 URL</p>
                <button
                  onClick={() => copyToClipboard(imageUrl)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {copied ? '복사됨!' : '복사'}
                </button>
              </div>
              <p className="font-mono text-xs text-blue-800 dark:text-blue-200 break-all">
                {imageUrl}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">직접 링크</p>
                <button
                  onClick={() => copyToClipboard(directUrl)}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  복사
                </button>
              </div>
              <p className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                {directUrl}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">마크다운</p>
                <button
                  onClick={() => copyToClipboard(`![${imageData.filename || 'image'}](${imageUrl})`)}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  복사
                </button>
              </div>
              <p className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                {`![${imageData.filename || 'image'}](${imageUrl})`}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML</p>
                <button
                  onClick={() => copyToClipboard(`<img src="${imageUrl}" alt="${imageData.filename || 'image'}" />`)}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  복사
                </button>
              </div>
              <p className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                {`<img src="${imageUrl}" alt="${imageData.filename || 'image'}" />`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => window.open(imageUrl, '_blank')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              새 탭에서 열기
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadResult