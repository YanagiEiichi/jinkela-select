class DemoBaseCode extends Jinkela {
  init() {
    hljs.highlightBlock(this.pre);
  }
  get styleSheet() {
    return `
      :scope {
        margin: 0;
        padding: 0;
        overflow: hidden;
        position: relative;
        padding-bottom: 44px; 
        box-sizing: border-box;
        max-height: 0px;
        transition: max-height 200ms;
        &.active {
          > button::before { content: '▲  Hide'; }
          max-height: 1000px;
        }
        > pre {
          margin: 0;
          background: #fafafa;
          border: solid #eaeefb;
          border-width: 1px 0 0 0;
          white-space: pre;
          font-family: Menlo, Monaco, Consolas, Courier, monospace;
          font-size: 12px;
          line-height: 1.8;
          padding: 18px 24px;
          -webkit-font-smoothing: auto;
        }
        > button {
          left: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          border: 0;
          border-top: 1px solid #eaeefb;
          height: 44px;
          line-height: 44px;
          width: 100%;
          text-align: center;
          outline: 0;
          color: #d3dce6;
          cursor: pointer;
          font-size: 14px;
          background: #fff;
          -webkit-font-smoothing: antialiased;
          transition: color 200ms;
          &::before { content: '▼  Expand'; }
          max-height: 1000px;
          &:hover {
            color: #409eff;
          }
        }
      }
    `;
  }
  toggle() { this.element.classList.toggle('active'); }
  get template() {
    return `
      <div>
        <pre class="html" ref="pre">{code}</pre>
        <button type="button" on-click="{toggle}"></button>
      </div>
    `;
  }
}

class DemoBase extends Jinkela { // eslint-disable-line no-unused-vars
  init() {
    new DemoBaseCode({ code: this.constructor.toString() }).to(this.element.lastElementChild);
  }
  get styleSheet() {
    return `
      :scope {
        > dt {
          font-weight: 400;
          color: #1f2f3d;
          font-size: 22px;
          margin: 55px 0 20px;
          + dd {
            overflow: hidden;
            transition: box-shadow 200ms;
            border: 1px solid #ebebeb;
            border-radius: 3px;
            margin: 0;
            &:hover {
              box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
            }
            > p {
              margin: 24px;
              > * { margin-right: 20px; }
            }
          }
        }
      }
    `;
  }
}
