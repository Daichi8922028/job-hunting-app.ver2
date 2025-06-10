# Job Hunting App

This repository contains a prototype web application for assisting job hunting activities.

## Sanitizing chat messages

The chat UI displays AI generated Markdown as HTML. To guard against XSS we load the [DOMPurify](https://github.com/cure53/DOMPurify) library in `index.html` and sanitize the HTML before inserting it into the page.

Include DOMPurify via CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.4/purify.min.js"></script>
```

`New/js/chat_system.js` parses Markdown with `marked` and then sanitizes the result:

```javascript
const html = marked.parse(content);
messageBubble.innerHTML = DOMPurify.sanitize(html);
```

If DOMPurify is not present, the raw HTML is used as a fallback.
