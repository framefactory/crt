/**
 * Frontend Template
 *
 * @author Ralph Wiedemeier <ralph@framefactory.ch>
 * @copyright (c) 2020 Frame Factory GmbH
 * @license MIT
 */

import "./styles/styles.scss";
import CrtScreen from "./CrtScreen";
import CrtContent from "./CrtContent";
import CrtTyped from "./CrtTyped";
import "./CrtText";
import "./CrtCursor";

import headerText from "!raw-loader!./content/header.txt";

////////////////////////////////////////////////////////////////////////////////

console.log(`
    ______                             ______           __                      
   / ____/________ _____ ___  ___     / ____/___ ______/ /_____  _______  __    
  / /_  / ___/ __ \`/ __ \`__ \\/ _ \\   / /_  / __ \`/ ___/ __/ __ \\/ ___/ / / /    
 / __/ / /  / /_/ / / / / / /  __/  / __/ / /_/ / /__/ /_/ /_/ / /  / /_/ /     
/_/   /_/   \\__,_/_/ /_/ /_/\\___/  /_/    \\__,_/\\___/\\__/\\____/_/   \\__, /      
                                                                   /____/ 
`);

const screen = new CrtScreen({ scanlines: true });
const content = new CrtContent();
screen.append(content);
document.body.prepend(screen);

let header: CrtTyped;
let menu: CrtTyped;

setTimeout(() => {
    header = new CrtTyped({ text: headerText, char: 15 });
    content.append(header);
    header.run();
}, 1000);

setTimeout(() => {
    header.getElementsByTagName("crt-cursor")[0].remove();
    menu = new CrtTyped({ char: 50 });
    menu.classList.add("menu");
    menu.innerHTML =
`<crt-text>!!! NEW WEBSITE COMING SOON !!!</crt-text><br>
<crt-text>MAIN MENU</crt-text><br>
<crt-text><a onclick="opt1()">1. VISIT OLD WEBSITE</a></crt-text>
<crt-text><a onclick="opt2()">2. PRINT CONTACT INFORMATION</a></crt-text>
<crt-text><a onclick="opt3()">3. ADMIN LOGIN</a></crt-text><br>
<crt-text>WHAT WOULD YOU LIKE TO DO?</crt-text<br><crt-cursor/>`;
    content.append(menu);
    menu.run();
}, 7000);

window["opt1"] = function() {
    setTimeout(() => window.location.href = "https://www.framefactory.ch", 500);
};

window["opt2"] = function() {
    setTimeout(() => window.location.href = "https://www.framefactory.ch", 500);
};

