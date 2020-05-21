/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
 * @license MIT
 */

export default class CrtBlock extends HTMLElement
{
    constructor()
    {
        super();
        this.classList.add("crt-block");
    }
}

customElements.define("crt-block", CrtBlock);
