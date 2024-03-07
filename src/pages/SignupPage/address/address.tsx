import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';

const Postcode: React.FC = () => {
  const [zipCode, setZipcode] = useState<string>('');
  const [roadAddress, setRoadAddress] = useState<string>('');
  const [detailAddress, setDetailAddress] = useState<string>(''); // 추가
  const [isOpen, setIsOpen] = useState<boolean>(false); //추가

  const completeHandler = (data: any) => {
    setZipcode(data.zonecode);
    setRoadAddress(data.roadAddress);
    setIsOpen(false); //추가
  };

  // Modal 스타일
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
      left: '0',
      margin: 'auto',
      width: '500px',
      height: '600px',
      padding: '0',
      overflow: 'hidden',
    },
  };

  // 검색 클릭
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // 상세 주소검색 event
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetailAddress(e.target.value);
  };

  // 추가
  const clickHandler = () => {
    if (detailAddress === '') {
      alert('상세주소를 입력해주세요.');
    } else {
      console.log(zipCode, roadAddress, detailAddress);
    }
  };

  return (
    <div className="inputForm">
      <label htmlFor={zipCode} className="form-label">
        주소
      </label>
      <div className="address">
      <input className="addressNumber" value={zipCode} readOnly placeholder="우편번호" />
      <button onClick={toggle}>우편번호 검색</button>
      </div>
      <br />
      <input className="user-info" value={roadAddress} readOnly placeholder="도로명 주소" />
      <br />
      <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
        <DaumPostcode onComplete={completeHandler} style={{ height: '100%' }} />
      </Modal>
      <input className="user-info" type="text" onChange={changeHandler} value={detailAddress} placeholder="상세주소" />
    </div>
  );
};

export default Postcode;
