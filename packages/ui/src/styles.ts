// Side-effect only module: importing this installs the shared visual layer.
//
// Deliberately NOT importing "@blueprintjs/icons/lib/css/blueprint-icons.css".
// That stylesheet is the icon *font*, which would emit .woff2 assets that a
// content script can only load if they are listed in web_accessible_resources.
// Blueprint 6 renders icons as inline SVG instead, and blueprint.css contains
// zero @font-face rules, so we avoid that whole problem by omitting it.
import "@blueprintjs/core/lib/css/blueprint-design-tokens.css";
import "@blueprintjs/core/lib/css/blueprint.css";

import "./base.css";
