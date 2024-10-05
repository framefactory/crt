/**
 * CRT - Analog screen effects for web applications.
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 * @license MIT
 */

export default class CrtText extends HTMLElement
{
    constructor(text?: string)
    {
        super();
        this.classList.add("crt-text");

        if (text) {
            this.append(new Text(text));
        }
    }
}

customElements.define("crt-text", CrtText);
