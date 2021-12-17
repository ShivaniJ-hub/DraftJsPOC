import React, { useState, useRef } from 'react';
import "../style/rich.css";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';

function BasicRichTextEditor() {
    const [editorState,setState] = useState(EditorState.createEmpty());
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
    const onChange = editorState => setState(editorState);
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== "unstyled"
      ) {
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

export default BasicRichTextEditor;
