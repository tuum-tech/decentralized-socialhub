import { IonRange } from '@ionic/react';
import styled from 'styled-components';

export const CoverActions = styled.div`
  position: absolute;
  z-index: 100;
  width: 100%;
  padding-right: 23px;
  padding-top: 11px;
`;

export const StyledCoverContainer = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 22px;
`;

export const StyledCoverImg = styled.img`
  object-fit: cover;
  width: 100%;
  height: 200px;
  border-radius: 10px;
`;

export const CropContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: #333;
  margin-bottom: 22px;
  border-radius: 16px;

  .reactEasyCrop_Container {
    border-radius: 16px;
  }
`;

export const SliderContainer = styled.div`
  float: right;
  margin-top: -60px;
  margin-right: 16px;
  width: 160px;
  height: 20px;
`;

export const StyledIonRange = styled(IonRange)`
  --bar-background: white;
  --bar-background-active: white;
  --knob-background: white;
  height: 20px;
  background: #00000080;
  border-radius: 8px;
`;

export const StyledUpload = styled.input`
  &::-webkit-file-upload-button {
    visibility: hidden;
  }
  &::before {
    display: inline-block;
    background: linear-gradient(top, #f9f9f9, #e3e3e3);
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  }
`;

export const StyledUploadLabel = styled.label`
  margin-bottom: 0;
  width: 50px;
`;
