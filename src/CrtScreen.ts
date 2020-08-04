/**
 * CRT
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
 * @license MIT
 */

export interface ICrtScreenOptions
{
    scanlines: boolean;
}

export default class CrtScreen extends HTMLElement
{
    static get observedAttributes()
    {
        return [ "scanlines" ];
    }

    constructor(options?: ICrtScreenOptions)
    {
        super();
        this.classList.add("crt-screen");

        if (options && options.scanlines) {
            this.classList.add("crt-scanlines");
        }
    }

    attributeChangedCallback(name: string, oldValue, newValue)
    {
        if (name === "scanlines") {
            if (newValue) {
                this.classList.add("crt-scanlines");
            }
            else {
                this.classList.remove("crt-scanlines");
            }
        }
    }
}

customElements.define("crt-screen", CrtScreen);
