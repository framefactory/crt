/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
 * @license MIT
 */

export default class CrtText extends HTMLElement
{
    constructor()
    {
        super();
        this.classList.add("crt-text");
    }
}

customElements.define("crt-text", CrtText);
