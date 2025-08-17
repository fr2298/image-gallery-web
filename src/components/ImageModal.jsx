import React, { useEffect, useState } from 'react'

function ImageModal({ image, apiBaseUrl, onClose }) {
  const [metadata, setMetadata] = useState(null)
  const [loadingMetadata, setLoadingMetadata] = useState(true)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/image/${image.id}/metadata`)
        if (response.ok) {
          const data = await response.json()
          setMetadata(data)
        }
      } catch (error) {
        console.error('Failed to fetch metadata:', error)
      } finally {
        setLoadingMetadata(false)
      }
    }

    fetchMetadata()

    // Close on ESC key
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [image.id, apiBaseUrl, onClose])

  const formatFileSize = (bytes) => {
    if (!bytes) return '-'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-2/3 bg-black flex items-center justify-center p-8">
            <img
              src={`${apiBaseUrl}/image/${image.id}?t=${image.uploadedAt || Date.now()}`}
              alt={image.filename || image.id}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>

          {/* Metadata Section */}
          <div className="lg:w-1/3 p-6 overflow-y-auto max-h-[70vh]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Image Details
            </h2>

            {loadingMetadata ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Basic Information
                  </h3>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">ID</dt>
                      <dd className="text-sm font-mono text-gray-900 dark:text-white break-all">{image.id}</dd>
                    </div>
                    {image.filename && (
                      <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Filename</dt>
                        <dd className="text-sm text-gray-900 dark:text-white break-all">{image.filename}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Size</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">{formatFileSize(image.size || metadata?.size)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Uploaded</dt>
                      <dd className="text-sm text-gray-900 dark:text-white">{formatDate(image.uploadedAt || metadata?.uploadedAt)}</dd>
                    </div>
                  </dl>
                </div>

                {/* Image Properties */}
                {metadata?.dimensions && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Image Properties
                    </h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Dimensions</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">
                          {metadata.dimensions.width} × {metadata.dimensions.height} pixels
                        </dd>
                      </div>
                      {metadata.format && (
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Format</dt>
                          <dd className="text-sm text-gray-900 dark:text-white uppercase">{metadata.format}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* EXIF Data */}
                {metadata?.exif && Object.keys(metadata.exif).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Camera Information
                    </h3>
                    <dl className="space-y-2">
                      {metadata.exif.Make && (
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Camera</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">
                            {metadata.exif.Make} {metadata.exif.Model}
                          </dd>
                        </div>
                      )}
                      {metadata.exif.LensModel && (
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Lens</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">{metadata.exif.LensModel}</dd>
                        </div>
                      )}
                      {metadata.exif.ExposureTime && (
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Exposure</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">{metadata.exif.ExposureTime}s</dd>
                        </div>
                      )}
                      {metadata.exif.FNumber && (
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Aperture</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">f/{metadata.exif.FNumber}</dd>
                        </div>
                      )}
                      {metadata.exif.ISO && (
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">ISO</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">{metadata.exif.ISO}</dd>
                        </div>
                      )}
                      {metadata.exif.DateTimeOriginal && (
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Taken</dt>
                          <dd className="text-sm text-gray-900 dark:text-white">
                            {formatDate(metadata.exif.DateTimeOriginal)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <a
                      href={`${apiBaseUrl}/image/${image.id}?t=${image.uploadedAt || Date.now()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Open Original
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${apiBaseUrl}/image/${image.id}?t=${image.uploadedAt || Date.now()}`)
                        // You could add a toast notification here
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageModal