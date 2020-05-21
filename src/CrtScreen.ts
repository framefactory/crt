/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
 * @license MIT
 */

export default class CrtScreen extends HTMLElement
{
    constructor()
    {
        super();
        this.classList.add("crt-screen");
    }
}

customElements.define("crt-screen", CrtScreen);
