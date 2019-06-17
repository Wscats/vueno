var _class, _temp;

import { WeElement, define, h } from "omi";
const mY = ((_temp = _class = class mY extends WeElement {
  render() {
    return h("div", null, "1234678910111213");
  }

  install() {
    this.data = {
      title: "omi"
    };
  }

  uninstall() {
    let a = "abc";
  }
}),
(_class.css = `p{color:red}
`),
(_class.abc = "123"),
_temp);
define("m-y", mY);
