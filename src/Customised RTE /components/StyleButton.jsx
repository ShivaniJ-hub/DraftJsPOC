import React from 'react'

function StyleButton(props) {
    const onToggle = e => {
        e.preventDefault();
        props.onToggle(props.style);
      }
      let className = "RichEditor-styleButton";
      if (props.active) {
        className += " RichEditor-activeButton";
      }
      if (props.hasSubtypes) {
        <select className={className} onMouseDown={onToggle}>
          {props.subtypes.map(subtype => (<option value={subtype}>{subtype}</option>))}
        </select>
      }
      return (
        <span className={className} onMouseDown={onToggle}>
          {props.label}
        </span>
      );
}

export default StyleButton;