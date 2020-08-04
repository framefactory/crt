/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
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
