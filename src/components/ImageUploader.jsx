import React, { useState, useRef } from 'react'
import UploadResult from './UploadResult'

function ImageUploader({ apiBaseUrl, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadUrl, setUploadUrl] = useState('')
  const [tags, setTags] = useState('')
  const [compressionQuality, setCompressionQuality] = useState(85)
  const [enableCompression, setEnableCompression] = useState(true)
  const [keepOriginalName, setKeepOriginalName] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false)
  const [duplicateFilename, setDuplicateFilename] = useState('')
  const fileInputRef = useRef(null)

  // 파일명 중복 체크 함수
  const checkDuplicateFilename = async (filename) => {
    if (!keepOriginalName) return false
    
    try {
      const response = await fetch(`${apiBaseUrl}/check-duplicate?filename=${encodeURIComponent(filename)}`)
      if (response.ok) {
        const data = await response.json()
        return data.exists || false
      }
    } catch (error) {
      console.error('Duplicate check error:', error)
    }
    return false
  }

  // 실제 업로드 처리 함수
  const proceedWithUpload = async (file, forceReplace = false) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    
    // 태그 추가
    if (tags.trim()) {
      formData.append('tags', tags.trim())
    }
    
    // 원본 파일명 유지 옵션 추가
    if (keepOriginalName) {
      formData.append('keepOriginalName', 'true')
    }
    
    // 덮어쓰기 옵션 (중복 확인 후 강제 덮어쓰기)
    if (forceReplace) {
      formData.append('replace', 'true')
    }

    try {
      // 압축 옵션을 쿼리 파라미터로 추가
      const params = new URLSearchParams()
      if (enableCompression) {
        params.append('quality', compressionQuality)
        params.append('format', 'webp')
      }
      
      const url = `${apiBaseUrl}/upload${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Upload successful:', data)
        // API 응답 구조 확인
        console.log('Response data structure:', {
          hasId: !!data.id,
          hasData: !!data.data,
          fullResponse: data
        })
        
        // data.data.id 또는 data.id 체크
        const imageInfo = data.data || data
        if (imageInfo.id) {
          const resultData = {
            id: imageInfo.id,
            filename: imageInfo.originalName || file.name, // API는 originalName 반환
            size: imageInfo.size || file.size,
            originalSize: file.size,
            compressedSize: imageInfo.size,
            uploadedAt: imageInfo.uploadedAt || new Date().toISOString(),
            tags: imageInfo.tags || [] // 태그 정보도 저장
          }
          setUploadResult(resultData)
          onUploadSuccess(resultData)
        } else {
          onUploadSuccess()
        }
        // Reset inputs
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setTags('')
        setPendingFile(null)
        setShowDuplicateConfirm(false)
        setDuplicateFilename('')
      } else {
        const errorText = await response.text()
        console.error('Upload failed:', errorText)
        alert('업로드 실패: ' + errorText)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  // 파일 업로드 핸들러 (중복 체크 포함)
  const handleFileUpload = async (file) => {
    if (!file) return

    // 원본 파일명 유지 옵션이 켜져 있을 때만 중복 체크
    if (keepOriginalName) {
      const isDuplicate = await checkDuplicateFilename(file.name)
      
      if (isDuplicate) {
        // 중복된 파일명이 있으면 확인 팝업 표시
        setPendingFile(file)
        setDuplicateFilename(file.name)
        setShowDuplicateConfirm(true)
        return
      }
    }

    // 중복이 없거나 원본 파일명 유지 옵션이 꺼져 있으면 바로 업로드
    await proceedWithUpload(file)
  }

  // 중복 확인 팝업에서 덮어쓰기 선택
  const handleConfirmReplace = async () => {
    if (pendingFile) {
      await proceedWithUpload(pendingFile, true)
    }
  }

  // 중복 확인 팝업에서 취소 선택
  const handleCancelUpload = () => {
    setPendingFile(null)
    setShowDuplicateConfirm(false)
    setDuplicateFilename('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUrlUpload = async () => {
    if (!uploadUrl) return

    setUploading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/upload-from-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: uploadUrl }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('URL upload successful:', data)
        // API 응답 구조 확인
        console.log('Response data structure:', {
          hasId: !!data.id,
          hasData: !!data.data,
          fullResponse: data
        })
        
        // data.data.id 또는 data.id 체크
        const imageInfo = data.data || data
        if (imageInfo.id) {
          onUploadSuccess({
            id: imageInfo.id,
            filename: imageInfo.filename || imageInfo.originalName || 'uploaded-image',
            size: imageInfo.size,
            uploadedAt: imageInfo.uploadedAt || new Date().toISOString()
          })
        } else {
          onUploadSuccess()
        }
        setUploadUrl('')
      } else {
        const errorText = await response.text()
        console.error('URL upload failed:', errorText)
        alert('URL 업로드 실패: ' + errorText)
      }
    } catch (error) {
      console.error('URL upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <>
      <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Image
        </label>
        
        {/* Drag & Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              <>
                <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>

      {/* Tags Input */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          태그 (콤마로 구분)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="예: 풍경, 여행, 2024"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          disabled={uploading}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          나중에 태그로 이미지를 검색할 수 있습니다
        </p>
      </div>

      {/* File Name Option */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          파일명 설정
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="keep-original-name"
              checked={keepOriginalName}
              onChange={(e) => setKeepOriginalName(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={uploading}
            />
            <label htmlFor="keep-original-name" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              원본 파일명 유지 (체크 해제 시 랜덤 ID 사용)
            </label>
          </div>
          <p className="ml-6 text-xs text-gray-500 dark:text-gray-400">
            원본 파일명 유지 시 중복 파일이 있으면 확인 후 덮어쓰기 가능합니다
          </p>
        </div>
      </div>

      {/* Compression Options */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          압축 설정
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enable-compression"
              checked={enableCompression}
              onChange={(e) => setEnableCompression(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enable-compression" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              이미지 압축 활성화
            </label>
          </div>
          {enableCompression && (
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                압축 품질:
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={compressionQuality}
                onChange={(e) => setCompressionQuality(e.target.value)}
                className="flex-1"
                disabled={uploading}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                {compressionQuality}%
              </span>
            </div>
          )}
        </div>
      </div>


      {/* URL Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Or upload from URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            disabled={uploading}
          />
          <button
            onClick={handleUrlUpload}
            disabled={uploading || !uploadUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </div>

    {/* Duplicate Confirmation Modal */}
    {showDuplicateConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            파일명 중복 확인
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            "<span className="font-semibold">{duplicateFilename}</span>" 파일이 이미 존재합니다.
            <br />
            기존 파일을 덮어쓰시겠습니까?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancelUpload}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleConfirmReplace}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              덮어쓰기
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Upload Result Modal */}
    {uploadResult && (
      <UploadResult
        imageData={uploadResult}
        apiBaseUrl={apiBaseUrl}
        onClose={() => setUploadResult(null)}
      />
    )}
  </>
  )
}

export default ImageUploader