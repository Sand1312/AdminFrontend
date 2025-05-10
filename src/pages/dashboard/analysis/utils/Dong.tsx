// components/Dong.tsx
import React from 'react';
import { dong } from '../components/Charts';

export default class Dong extends React.Component<{
  children: React.ReactText;
}> {
  main: HTMLSpanElement | undefined | null = null;

  componentDidMount() {
    this.renderToHtml();
  }

  componentDidUpdate() {
    this.renderToHtml();
  }

  renderToHtml = () => {
    const { children } = this.props;
    if (this.main) {
      this.main.innerHTML = dong(children);
    }
  };

  render() {
    return (
      <span
        ref={(ref) => {
          this.main = ref;
        }}
      />
    );
  }
}
