import { useState, useEffect } from 'react';
import copyIcon from '../../assets/images/icon-copy.svg';
import checkIcon from '../../assets/images/icon-copy-complete.svg';

function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <button type="button" className="copy-button" onClick={handleCopy}>
      <img
        src={copied ? checkIcon : copyIcon}
        alt={copied ? '복사됨' : '복사하기'}
        className={`icon ${copied ? 'copied' : ''}`}
      />
    </button>
  );
}

export default CopyButton;
