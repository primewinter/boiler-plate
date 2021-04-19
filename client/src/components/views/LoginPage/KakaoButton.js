import React, { useEffect } from 'react'
import dotenv from 'dotenv';
dotenv.config();

console.log('key', process.env.REACT_APP_HELLO);
const KakaoButton = () => {
  useEffect(() => {
    createKakaoButton()
  }, [])
  const createKakaoButton = () => {
    // kakao sdk script이 정상적으로 불러와졌으면 window.Kakao로 접근이 가능합니다
    console.log(window.Kakao);
    if (window.Kakao) {
        console.log('window.Kakao == true');
      const kakao = window.Kakao
      // 중복 initialization 방지
      if (!kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
        console.log('initialized');
      }
      kakao.Link.createDefaultButton({
        container: '#create-kakao-link-btn',
        objectType: 'feed',
        content: {
            title: 'TITLE',
            description: 'DESCRIPTION',
            imageUrl:
                'http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
            link: {
                mobileWebUrl: 'http://localhost:3000/api/hello',
                webUrl: 'http://localhost:3000/api/hello',
            },
        },
        buttons: [
            {
                title: '테스트 하러가기',
                link: {
                    mobileWebUrl: 'http://localhost:3000/api/hello',
                    webUrl: 'http://localhost:3000/api/hello',
                },
            }
        ]
    });
  }
}
  return (
    <div className="kakao-share-button">
      <button id="create-kakao-link-btn">
        <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"/>
      </button>
    </div>
  )
}
export default KakaoButton