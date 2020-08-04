/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
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
