import { Minus } from '@strapi/icons';
import { Transforms } from 'slate';
import { styled } from 'styled-components';

import { type BlocksStore } from '../BlocksEditor';

const SeparatorWrapper = styled.div`
  margin: ${({ theme }) => theme.spaces[4]} 0;
  width: 100%;
  position: relative;
`;

interface SeparatorLineProps {
  $borderStyle: string;
  $borderColor?: string;
}

const SeparatorLine = styled.hr<SeparatorLineProps>`
  border: none;
  margin: 0;
  padding: 0;
  background: none;
  width: 100%;
  height: 0;
  /* Always display as horizontal in editor, orientation is stored for external use */
  border-top: ${({ $borderStyle, $borderColor, theme }) =>
    `1px ${$borderStyle} ${$borderColor || theme.colors.neutral300}`};
`;

const separatorBlocks: Pick<BlocksStore, 'separator'> = {
  separator: {
    renderElement: (props) => {
      const element = props.element as any;

      // Get non-viewport specific properties
      const separatorStyle = element.separatorStyle || 'solid';
      const separatorColor = element.separatorColor;

      return (
        <SeparatorWrapper>
          <SeparatorLine
            {...props.attributes}
            $borderStyle={separatorStyle}
            $borderColor={separatorColor}
          />
          <span style={{ display: 'none' }}>{props.children}</span>
        </SeparatorWrapper>
      );
    },
    icon: Minus,
    label: {
      id: 'components.Blocks.blocks.separator',
      defaultMessage: 'Separator',
    },
    matchNode: (node) => 'type' in node && (node as any).type === 'separator',
    isInBlocksSelector: true,
    handleConvert(editor) {
      Transforms.insertNodes(editor, {
        type: 'separator',
        children: [{ type: 'text', text: '' }],
      } as any);
    },
    snippets: ['---', '***'],
  },
};

export { separatorBlocks };