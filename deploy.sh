#!/bin/bash

echo "🎨 Image Gallery Web - Vercel 배포 스크립트"
echo "==========================================="

# 1. 의존성 설치 확인
echo "📦 의존성 확인 중..."
if [ ! -d "node_modules" ]; then
    echo "의존성 설치 중..."
    npm install
fi

# 2. 빌드 테스트
echo "🔨 프로덕션 빌드 테스트..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 빌드 실패! 오류를 수정하고 다시 시도하세요."
    exit 1
fi

echo "✅ 빌드 성공!"

# 3. Vercel CLI 설치 확인
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLI 설치 중..."
    npm i -g vercel
fi

# 4. 배포 옵션 선택
echo ""
echo "배포 방법을 선택하세요:"
echo "1) Vercel CLI로 직접 배포"
echo "2) GitHub 연동 안내"
read -p "선택 (1 또는 2): " choice

case $choice in
    1)
        echo "🚀 Vercel로 배포 시작..."
        vercel --prod
        
        echo ""
        echo "✅ 배포 완료!"
        echo "📌 환경변수를 Vercel 대시보드에서 설정하세요:"
        echo "   VITE_API_URL=https://image-hosting-api.d7bac8971083ed89cb3387f9af9ac079.workers.dev"
        ;;
    2)
        echo ""
        echo "📘 GitHub 연동 배포 가이드:"
        echo "1. 코드를 GitHub에 푸시"
        echo "   git add ."
        echo "   git commit -m 'Ready for Vercel deployment'"
        echo "   git push origin main"
        echo ""
        echo "2. https://vercel.com/new 접속"
        echo "3. GitHub 레포지토리 연결"
        echo "4. 환경변수 설정:"
        echo "   VITE_API_URL=https://image-hosting-api.d7bac8971083ed89cb3387f9af9ac079.workers.dev"
        echo "5. Deploy 클릭"
        ;;
    *)
        echo "잘못된 선택입니다."
        exit 1
        ;;
esac

echo ""
echo "📝 배포 후 체크리스트:"
echo "✓ API 서버 (Cloudflare Workers) 실행 확인"
echo "✓ 갤러리 웹 접속 테스트"
echo "✓ 이미지 업로드 테스트"
echo "✓ 이미지 조회 테스트"