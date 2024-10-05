/**
 * CRT - Analog screen effects for web applications.
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 * @license MIT
 */

export default class CrtCursor extends HTMLElement
{
    constructor()
    {
        super();
        this.classList.add("crt-cursor");
    }
}

customElements.define("crt-cursor", CrtCursor);
