/**
 * CRT - Analog screen effects for web applications.
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 * @license MIT
 */

export default class CrtContent extends HTMLElement
{
    constructor()
    {
        super();
        this.classList.add("crt-content", "crt-glitch");
    }
}

customElements.define("crt-content", CrtContent);
