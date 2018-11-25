function submit(redirection, hasUrl) {
  var textarea = document.getElementById("textarea");
  var result = convertToJsonParam(textarea.value, hasUrl);
  var encodedResult = encodeURI(JSON.stringify(result));
  window.location.replace(`${redirection}?text=${btoa(encodedResult)}`);
}

function convertToJsonParam(text, hasUrl) {
  let data = text.replace('\t', '');
  if(hasUrl) {
    data = data.split('\n');
  } else {
    data = data.replace('.', '\n').split('\n');
  }
  return { data };
}