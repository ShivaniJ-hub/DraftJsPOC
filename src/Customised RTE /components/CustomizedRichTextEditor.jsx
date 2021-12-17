import React, { useState, useRef } from 'react';
import "./rich.css";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';

// Custom overrides for "code" style.
const styleMap = {
    STRIKETHROUGH: {
      textDecoration: 'line-through',
    }
  };
function CustomizedRichTextEditor() {
    const [editorState,setState] = useState(EditorState.createEmpty());
    const getBlockStyle = (block) => {
      switch (block.getType()) {
        case "blockquote":
          return "RichEditor-blockquote";
        case "align-left":
          console.log('LEFT');
          return "RichEditor-align-left";
        case "align-center":
          console.log('CENTER');
          return "RichEditor-align-center";
        case "align-right":
          return "RichEditor-align-right";
        case "align-justify":
          return "RichEditor-align-justify";
        case 'image':
          return {
            component: Image,
            editable: false,
          }
        default:
          return null;
      }
    }
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          onChange(newState);
          return true;
        }
        return false;
      }
    
    const mapKeyToEditorCommand = (e) => {
        if (e.keyCode === 9 /* TAB */) {
          const newEditorState = RichUtils.onTab(
            e,
            editorState,
            4 /* maxDepth */
          );
          if (newEditorState !== editorState) {
            onChange(newEditorState);
          }
          return;
        }
        return getDefaultKeyBinding(e);
      }
    const toggleBlockType = (blockType) => {
      onChange(RichUtils.toggleBlockType(editorState, blockType));
    }
    const toggleInlineStyle = (inlineStyle) => {
        onChange(
          RichUtils.toggleInlineStyle(editorState, inlineStyle)
        );
      }

    const editorRef = useRef();
    const focus = () => editorRef.current.focus();
    const onChange = (editorState) => {
      console.log('EditorState: ',editorState.toJS());
      return setState(editorState);
    };

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }
    
    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
        <div className={className} onClick={focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            onChange={onChange}
            placeholder="Tell a story..."
            ref={editorRef}
            spellCheck={true}
          />
        </div>
      </div>
    );
}

export default CustomizedRichTextEditor;
