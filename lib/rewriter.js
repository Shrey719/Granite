import $gr from "./config.js";
import { parse } from 'node-html-parser';

let global_url = ''
function rewrite(text, url) {
    global_url = url;
  let root = parse(text);
  
  // <script src=> stuff
  root.querySelectorAll("script[src]").forEach((script) => {
    let src = script.getAttribute('src');
    script.setAttribute('src', rewriteUrl(src, url));
  });

  // inline js
  // TODO - inline js rewriting
  root.querySelectorAll("script:not([src])").forEach((script) => {

  });

  // TODO - convert images into dataurls and then load them that way
  root.querySelectorAll("img[src]").forEach((img) => {
    let src = img.getAttribute('src');
    img.setAttribute('src', rewriteUrl(src, url));
  });

  // rewrite all of the attributes. universaly. This is a bad idea.
  // my code is fucking ass
  const refAttr = ['href', 'action', 'data-src'];
  refAttr.forEach(attr => {
    root.querySelectorAll(`[${attr}]`).forEach((el) => {
      let attrValue = el.getAttribute(attr);
      el.setAttribute(attr, rewriteUrl(attrValue, url));
    });
  });

  return root.toString();
}

function rewriteUrl(ustr, burl) {
    if (!ustr) return ustr;

    // Handle javascript: URLs
    if (ustr.trim().toLowerCase().startsWith('javascript:')) {
      let csrc = ustr.trim().slice(11);
      // if it changes location.href or window.location.href, change it
      if (csrc.includes('location.href') || csrc.includes('window.location.href')) {
        console.log(global_url);
        return 'javascript:' + csrc.replace(/(location\.href|window\.location\.href)\s*=\s*['"]([^'"]+)['"]/g, `$1 = '${$gr.prefix+'?q='+global_url}$2'`);    
      }
      return ustr;
    }

    try {
      const furl = new URL(ustr, burl).href;
      return $gr.prefix + '?q=' + furl;
    } catch (e) {
      return ustr;
    }
}
export default rewrite;