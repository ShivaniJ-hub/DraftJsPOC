import React, { Component, useState, useRef, useMemo, useCallback } from 'react';
import '../styles/editorStyles.css'
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/mention/lib/plugin.css';
import Editor , {createEditorStateWithText} from '@draft-js-plugins/editor';
import mentions from './Mentions';
import createToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/static-toolbar';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
  } from '@draft-js-plugins/buttons';
const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const text =
  'In this editor a toolbar shows up once you select part of the text …';
function RichTextEditorUsingPlugins() {
    const [editorState,setState] = useState(createEditorStateWithText(text));
    const editorRef = useRef();
    const focus = () => editorRef.current.focus();
    const onChange = editorState => {console.log('editorState: ',editorState.toJS())
      return setState(editorState)};
      const [open, setOpen] = useState(false);
      const [suggestions, setSuggestions] = useState(mentions);
    
      const { MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin();
        // eslint-disable-next-line no-shadow
        const { MentionSuggestions } = mentionPlugin;
        // eslint-disable-next-line no-shadow
        const plugins = [mentionPlugin,toolbarPlugin];
        return { plugins, MentionSuggestions };
      }, []);
      const onOpenChange = useCallback((_open) => {
        setOpen(_open);
      }, []);
      const onSearchChange = useCallback(({ value }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions));
      }, []);

    return (
        <div>
          <div className='editor' onClick={focus}>
            <Toolbar>
              {
                // may be use React.Fragment instead of div to improve perfomance after React 16
                (externalProps) => (
                  <div>
                    <BoldButton {...externalProps} />
                    <ItalicButton {...externalProps} />
                    <UnderlineButton {...externalProps} />
                    <CodeButton {...externalProps} />
                    <Separator {...externalProps} />
                    <HeadlinesButton {...externalProps} />
                    <UnorderedListButton {...externalProps} />
                    <OrderedListButton {...externalProps} />
                    <BlockquoteButton {...externalProps} />
                    <CodeBlockButton {...externalProps} />
                  </div>
                )
              }
            </Toolbar>
            <MentionSuggestions
              open={open}
              onOpenChange={onOpenChange}
              suggestions={suggestions}
              onSearchChange={onSearchChange}
              onAddMention={() => {
                // get the mention object selected
              }}
            />
            <br/>
            <Editor
              editorState={editorState}
              onChange={onChange}
              plugins={plugins}
              ref={editorRef}
            />
          </div>
        </div>
      );
}

export default RichTextEditorUsingPlugins;
class HeadlinesPicker extends Component {
  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('click', this.onWindowClick);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) => (
          // eslint-disable-next-line
          <Button key={i} {...this.props} />
        ))}
      </div>
    );
  }
}

class HeadlinesButton extends Component {
  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className='headlineButtonWrapper'>
        <button onClick={this.onClick} className='headlineButton'>
          H
        </button>
      </div>
    );
  }
}
