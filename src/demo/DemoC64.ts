/**
 * CRT - Analog screen effects for web applications.
 * Copyright 2024 Ralph Wiedemeier, Frame Factory GmbH
 */

import {
    customElement,
    CustomElement,
    html,
} from "@ffweb/lit/CustomElement.js";

import "../components/CrtScreen.js";
import "../components/CrtContent.js";
import "../components/CrtText.js";
import "../components/CrtCursor.js";

////////////////////////////////////////////////////////////////////////////////

@customElement("ff-demo-c64")
export class DemoC64 extends CustomElement
{
    protected render()
    {
        return html`
            <div class="crt-screen crt-scanlines crt-flicker">
                <div class="crt-content crt-glitch">
                    <span class="crt-text">Hello, World!</span>
                    <span class="crt-text">Hello, World!</span>
                    <span class="crt-cursor"></span>
                </div>
            </div>
        `;
    }
}