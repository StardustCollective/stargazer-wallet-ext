import React, { FC } from 'react';

import { ellipsis } from 'scenes/home/helpers';
import { useCopyClipboard } from 'hooks/index';

import AssetHeader from './AssetHeader';

import { IAssetHeader } from './types';

const AssetHeaderContainer: FC<IAssetHeader> = ({ asset, address }) => {
  const [isCopied, copyText] = useCopyClipboard(2000);

  const onClickCopyText = (e: Event) => {
    e.stopPropagation();
    copyText(address);
  };

  const shortenedAddress = ellipsis(address);
  const copiedTextToolip = isCopied ? 'Copied' : 'Copy Address';

  return (
    <AssetHeader
      isCopied={isCopied}
      onClickCopyText={onClickCopyText}
      shortenedAddress={shortenedAddress}
      asset={asset}
      copiedTextToolip={copiedTextToolip}
    />
  );
};

export default AssetHeaderContainer;
