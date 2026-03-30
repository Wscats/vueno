'use strict';

const str="123abZW863";
const reg=/ab(?=[A-Z])/;
console.log(str.match(reg));
