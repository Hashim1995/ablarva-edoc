/* eslint-disable no-else-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-prototype-builtins */
import { Modal } from 'antd';
import { selectOption } from '@/models/common';
import { IHTTPSParams } from '@/services/adapter-config/config';
// import { noTxt, sureModalDescription, sureModalTitle, yesTxt } from '../constants/texts';
import { dictionary } from '../constants/dictionary';

/* eslint-disable no-restricted-syntax */
function convertFormDataToQueryParams<T>(formData: T): IHTTPSParams[] {
  const z: IHTTPSParams[] = [];
  for (const key in formData) {
    if (formData?.hasOwnProperty(key)) {
      z.push({
        name: key,
        value: formData[key] as string | number | null | selectOption
      });
    }
  }
  return z;
}

interface IshowCloseConfirmationModal {
  onClose: () => void;
  titleText?: string;
  descriptionText?: string;
  closeText?: string;
  okText?: string;
}

const showCloseConfirmationModal = ({
  onClose,
  titleText,
  descriptionText,
  closeText,
  okText
}: IshowCloseConfirmationModal) => {
  Modal.confirm({
    title: titleText ?? dictionary.en.confirmTitle,
    content: descriptionText ?? dictionary.en.confirmDelete,
    onOk: onClose,
    cancelText: closeText ?? dictionary.en.noTxt,
    okText: okText ?? dictionary.en.yesTxt
  });
};

function convertBytesToReadableSize(bytes: number): string {
  const suffixes: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  let i: number = 0;
  while (bytes >= 1024 && i < suffixes.length - 1) {
    bytes /= 1024;
    i++;
  }

  const sizeFormat: string = `${bytes?.toFixed(1)} ${suffixes[i]}`;
  return sizeFormat;
}

function formatDate(inputDateTime: string | Date): string {
  const date = new Date(inputDateTime);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are zero-based
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function formatDateToWords(date: Date | string): string {
  const now = new Date();
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    const seconds = Math.floor(diff / 1000);
    return `${seconds}  ${dictionary.en.second} ${dictionary.en.ago}`;
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}  ${dictionary.en.minute} ${dictionary.en.ago}`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}  ${dictionary.en.hour} ${dictionary.en.ago}`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}  ${dictionary.en.day} ${dictionary.en.ago}`;
  } else if (diff < month) {
    const weeks = Math.floor(diff / week);
    return `${weeks}  ${dictionary.en.week} ${dictionary.en.ago}`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months}  ${dictionary.en.month} ${dictionary.en.ago}`;
  } else {
    const years = Math.floor(diff / year);
    return `${years}  ${dictionary.en.year} ${dictionary.en.ago}`;
  }
}

function generateOptionListPerNumber(num: number): selectOption[] {
  const data = [];
  for (let i = 1; i < num + 1; i++) {
    data.push({
      value: i,
      label: `${i}`
    });
  }
  return data;
}

export {
  convertFormDataToQueryParams,
  generateOptionListPerNumber,
  convertBytesToReadableSize,
  showCloseConfirmationModal,
  formatDateToWords,
  formatDate
};
