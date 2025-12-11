import React from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import {
  Box,
  Flex,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import { Editor, Element } from 'slate';
import { styled } from 'styled-components';
import { useBlocksEditorContext } from './BlocksEditor';
import { CustomElement } from './utils/types';
import {
  // Global
  COLORS_OPTIONS,
  COLOR_TOKENS_OPTIONS,
  FONT_TOKENS_OPTIONS,
  DEFAULT_COLOR,
  // Separator
  SEPARATOR_STYLE_OPTIONS,
  DEFAULT_SEPARATOR_STYLE,
} from './utils/optionsDefaults';
import { getOptionsWithFallback } from './utils/optionsParser';

export const ToolbarSeparator = styled(Toolbar.Separator)`
  background: ${({ theme }) => theme.colors.neutral150};
  width: 1px;
  height: 2.4rem;
`;

const SelectWrapper = styled(Box)`
  div[role='combobox'] {
    cursor: pointer;
    min-height: unset;
    padding-top: 6px;
    padding-bottom: 6px;

    &[aria-disabled='false']:hover {
      cursor: pointer;
      background: ${({ theme }) => theme.colors.primary100};
    }

    &[aria-disabled] {
      background: transparent;
      cursor: inherit;

      span {
        color: ${({ theme }) => theme.colors.neutral600};
      }
    }
  }

  div[role='combobox'] {
    border: none;
  }
`;

const ColorPickerWrapper = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary100};
    border-color: ${({ theme }) => theme.colors.primary200};
  }

  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const ColorInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  background-color: ${(props) => props.color};
  border: 2px solid ${({ theme }) => theme.colors.neutral0};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius};
  flex-shrink: 0;
`;

const ColorLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral800};
  white-space: nowrap;
  user-select: none;
`;

const ResetButton = styled.button`
  position: relative;
  z-index: 1;
  background: ${({ theme }) => theme.colors.danger100};
  border: 1px solid ${({ theme }) => theme.colors.danger200};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 4px 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.danger700};
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.danger200};
    border-color: ${({ theme }) => theme.colors.danger600};
  }

  &:active {
    background: ${({ theme }) => theme.colors.danger600};
    color: ${({ theme }) => theme.colors.neutral0};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface TokenOption {
  label: string;
  value: string;
}

interface PluginOptions {
  disableDefaultColors?: boolean;
  disableDefaultColorTokens?: boolean;
  disableDefaultFontTokens?: boolean;
  customColorsPresets?: string;
  customColorTokensPresets?: TokenOption[];
  customFontTokensPresets?: TokenOption[];
  [key: string]: any;
}

const StyleToolbar = () => {
  const { editor, disabled, pluginOptions = {} } = useBlocksEditorContext('StyleToolbar');

  // Get styling options based on plugin configuration
  const typedPluginOptions = pluginOptions as PluginOptions;

  const colorOptions = getOptionsWithFallback(
    COLORS_OPTIONS,
    typedPluginOptions?.customColorsPresets,
    typedPluginOptions?.disableDefaultColors
  );

  // Color tokens use array format, not string parsing
  const colorTokenOptions = (() => {
    const customTokens = typedPluginOptions?.customColorTokensPresets;
    const disableDefaults = typedPluginOptions?.disableDefaultColorTokens;

    if (customTokens && customTokens.length > 0) {
      return disableDefaults ? customTokens : [...COLOR_TOKENS_OPTIONS, ...customTokens];
    }
    return disableDefaults ? [] : COLOR_TOKENS_OPTIONS;
  })();

  // Font tokens use array format, not string parsing
  const fontTokenOptions = (() => {
    const customTokens = typedPluginOptions?.customFontTokensPresets;
    const disableDefaults = typedPluginOptions?.disableDefaultFontTokens;

    if (customTokens && customTokens.length > 0) {
      return disableDefaults ? customTokens : [...FONT_TOKENS_OPTIONS, ...customTokens];
    }
    return disableDefaults ? [] : FONT_TOKENS_OPTIONS;
  })();

  const defaultColor = colorOptions.length > 0 ? colorOptions[0].value : DEFAULT_COLOR;
  const separatorStyleOptions = SEPARATOR_STYLE_OPTIONS;

  // Get current selected node
  const entry = editor.selection
    ? Editor.above(editor, {
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && 'type' in n,
      })
    : null;

  const selectedNode = entry ? (entry[0] as CustomElement) : null;
  const currentPath = entry ? entry[1] : [];

  // Get current marks for inline styles (fontColor, backgroundColor)
  const marks = Editor.marks(editor) as { [key: string]: string } | null;

  // Get current values
  const fontFamily = (marks?.fontFamily as string) || '';
  const fontColor = (marks?.fontColor as string) || defaultColor;
  const backgroundColor = (marks?.backgroundColor as string) || 'transparent';
  const separatorStyle = selectedNode?.separatorStyle || DEFAULT_SEPARATOR_STYLE;
  const separatorColor = selectedNode?.separatorColor || defaultColor;

  // Handle font family change (inline mark)
  const handleFontFamilyChange = (value: string | number) => {
    const stringValue = String(value);
    Editor.addMark(editor, 'fontFamily', stringValue);
  };

  // Reset font family
  const handleResetFontFamily = () => {
    Editor.removeMark(editor, 'fontFamily');
  };

  // Handle font color change (inline mark)
  const handleFontColorChange = (value: string | number) => {
    const stringValue = String(value);
    Editor.addMark(editor, 'fontColor', stringValue);
  };

  // Handle background color change (inline mark)
  const handleBackgroundColorChange = (value: string | number) => {
    const stringValue = String(value);
    Editor.addMark(editor, 'backgroundColor', stringValue);
  };

  // Reset font color to default
  const handleResetFontColor = () => {
    Editor.removeMark(editor, 'fontColor');
  };

  // Reset background color to transparent
  const handleResetBackgroundColor = () => {
    Editor.removeMark(editor, 'backgroundColor');
  };

  if (!selectedNode) {
    return null;
  }

  const showFontOptions =
    selectedNode?.type && !['image', 'code', 'separator'].includes(selectedNode.type);
  const showSeparatorOptions = selectedNode?.type === 'separator';

  return (
    <>
      <Flex gap={2}>
        {/* Font Token Selector */}
        {showFontOptions && fontTokenOptions.length > 0 && (
          <>
            <SelectWrapper>
              <SingleSelect
                placeholder="Font"
                onChange={(value) => handleFontFamilyChange(String(value))}
                value={fontFamily.startsWith('var(') ? fontFamily : ''}
                disabled={disabled}
                aria-label="Select font token"
              >
                {fontTokenOptions.map((option) => (
                  <SingleSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </SelectWrapper>
            {fontFamily && (
              <ResetButton
                onClick={handleResetFontFamily}
                disabled={disabled}
                aria-label="Reset font"
                type="button"
              >
                ×
              </ResetButton>
            )}
          </>
        )}

        {/* Color Token Selector */}
        {showFontOptions && colorTokenOptions.length > 0 && (
          <SelectWrapper>
            <SingleSelect
              placeholder="Color"
              onChange={(value) => handleFontColorChange(String(value))}
              value={fontColor.startsWith('var(') ? fontColor : ''}
              disabled={disabled}
              aria-label="Select color token"
            >
              {colorTokenOptions.map((option) => (
                <SingleSelectOption key={option.value} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </SelectWrapper>
        )}

        {/* Font Color Picker */}
        {showFontOptions && (
          <>
            <ColorPickerWrapper aria-disabled={disabled}>
              <ColorInput
                type="color"
                value={fontColor.startsWith('var(') ? '#000000' : fontColor}
                onChange={(e) => handleFontColorChange(e.target.value)}
                disabled={disabled}
                aria-label="Select font color"
              />
              <ColorPreview color={fontColor.startsWith('var(') ? '#808080' : fontColor} />
              <ColorLabel>{fontColor.startsWith('var(') ? 'Token' : fontColor.toUpperCase()}</ColorLabel>
            </ColorPickerWrapper>
            <ResetButton
              onClick={handleResetFontColor}
              disabled={disabled}
              aria-label="Reset font color"
              type="button"
            >
              ×
            </ResetButton>
          </>
        )}

        {/* Background Color Picker */}
        {showFontOptions && (
          <>
            <ColorPickerWrapper aria-disabled={disabled}>
              <ColorInput
                type="color"
                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                disabled={disabled}
                aria-label="Select background color"
              />
              <ColorPreview color={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor} />
              <ColorLabel>{backgroundColor === 'transparent' ? 'BG' : backgroundColor.toUpperCase()}</ColorLabel>
            </ColorPickerWrapper>
            <ResetButton
              onClick={handleResetBackgroundColor}
              disabled={disabled}
              aria-label="Reset background color"
              type="button"
            >
              ×
            </ResetButton>
          </>
        )}

        {/* Separator Controls */}
        {showSeparatorOptions && (
          <>
            {/* Separator Style */}
            <SelectWrapper>
              <SingleSelect
                placeholder="Style"
                onChange={(value) => {
                  if (!currentPath.length) return;
                  Editor.withoutNormalizing(editor, () => {
                    const properties = {
                      separatorStyle: String(value),
                    } as unknown as Partial<Node>;
                    editor.apply({
                      type: 'set_node',
                      path: currentPath,
                      properties,
                      newProperties: properties,
                    });
                  });
                }}
                value={separatorStyle}
                disabled={disabled}
                aria-label="Select separator style"
              >
                {separatorStyleOptions.map((option) => (
                  <SingleSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </SelectWrapper>

            {/* Separator Color Picker */}
            <ColorPickerWrapper aria-disabled={disabled}>
              <ColorInput
                type="color"
                value={separatorColor}
                onChange={(e) => {
                  if (!currentPath.length) return;
                  Editor.withoutNormalizing(editor, () => {
                    const properties = {
                      separatorColor: e.target.value,
                    } as unknown as Partial<Node>;
                    editor.apply({
                      type: 'set_node',
                      path: currentPath,
                      properties,
                      newProperties: properties,
                    });
                  });
                }}
                disabled={disabled}
                aria-label="Select separator color"
              />
              <ColorPreview color={separatorColor} />
              <ColorLabel>{separatorColor.toUpperCase()}</ColorLabel>
            </ColorPickerWrapper>
          </>
        )}
      </Flex>
    </>
  );
};

export default StyleToolbar;
