/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
 * @license MIT
 */

import CrtCursor from "./CrtCursor.js";

////////////////////////////////////////////////////////////////////////////////

export interface ICrtTypedOptions
{
    text?: string;
    char?: number;
    line?: number;
    cursor?: boolean;
}

interface ITextItem
{
    node: Text;
    text: string;
    offset: number;
}

export default class CrtTyped extends HTMLElement
{
    static get observedAttributes()
    {
        return [ "run", "char", "line", "cursor" ];
    }

    private _items: ITextItem[] = [];
    private _handler = 0;
    private _start = 0;
    private _index = 0;

    private _char: number;
    private _line: number;
    private _cursor: boolean;

    constructor(options?: ICrtTypedOptions)
    {
        super();
        this.classList.add("crt-typed");

        this._updateAnimation = this._updateAnimation.bind(this);

        options = options || {};
        this._char = options.char !== undefined ? options.char : 20;
        this._line = options.line !== undefined ? options.line : 0;
        this._cursor = options.cursor !== undefined ? options.cursor : true;

        if (options.text) {
            this.append(new Text(options.text));
        }
        if (this._cursor) {
            this.append(new CrtCursor());
        }
    }

    run()
    {
        this._cancelAnimation();
        this._initAnimation();
        this._runAnimation();
    }

    connectedCallback()
    {
    }

    disconnectedCallback()
    {
        this._cancelAnimation();
    }

    attributeChangedCallback(name: string, oldValue, newValue)
    {
        console.log("ATTR", name, oldValue, newValue);
        switch (name) {
            case "run":
                if (newValue !== null && !this._handler) {
                    this._cancelAnimation();
                    this._initAnimation();
                    this._runAnimation();
                }
                else if (newValue === null && this._handler) {
                    this._cancelAnimation();
                }
                break;
            case "char":
                this._char = parseInt(newValue) || 0;
                break;
            case "line":
                this._line = parseInt(newValue) || 0;
                break;
            case "cursor":
                this._cursor = newValue !== null;
        }
    }

    private _initAnimation()
    {
        console.log("[CrtBlock] init animation");
        const iter = document.createNodeIterator(this, NodeFilter.SHOW_TEXT, null);
        const items = this._items = [];

        let length = 0;
        let node: Node;

        while (node = iter.nextNode()) {
            const text = node.textContent;
            node.textContent = "";
            const offset = length;
            length += text.length;
            items.push({ node, text, offset });
        }
    }

    private _runAnimation()
    {
        if (!this._handler) {
            console.log("[CrtBlock] run animation");
            this._start = performance.now();
            this._index = 0;

            this._handler = window.requestAnimationFrame(this._updateAnimation);
            this.setAttribute("run", "true");
        }
    }

    private _cancelAnimation()
    {
        if (this._handler) {
            console.log("[CrtBlock] cancel animation");
            window.cancelAnimationFrame(this._handler);
            this._handler = 0;
        }
    }

    private _updateAnimation()
    {
        this._handler = window.requestAnimationFrame(this._updateAnimation);
        const elapsed = performance.now() - this._start;
        const pos = Math.trunc(elapsed / this._char);

        let item = this._items[this._index];
        while(pos >= item.offset + item.text.length) {
            item.node.textContent = item.text;
            item = this._items[++this._index];
            if (!item) {
                this._cancelAnimation();
                this.removeAttribute("run");
                return;
            }
        }

        const text = item.text.substr(0, pos - item.offset);
        item.node.textContent = text + (this._cursor ? "\u258C" : "");
    }
}

customElements.define("crt-typed", CrtTyped);
