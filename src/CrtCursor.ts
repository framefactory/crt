/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
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
