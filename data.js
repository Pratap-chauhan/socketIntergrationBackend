// Domains from Naukri
// URL = https://www.naukri.com/hpms/previewCategory?section=1
function processDomains() {
  const opts = document.getElementsByClassName('optGrp');
  const data = [];
  for (let i = 0; i < opts.length; i++) {
    data.push(opts[i].innerText);
  }
  return data;
}

// Techs from Wapplyzer
// URL: https://www.wappalyzer.com/technologies
function processTechs() {
	var data ={};
	var currentParent = null;
	var content = document.getElementsByClassName('content');
	content = content[0];
	for(var item of content.childNodes) {
		if (item.tagName === 'h2' || item.tagName === 'H2') {
			var name = item.innerText;
			currentParent = name;
			if(!data[name]) {
				data[name] = {path: item.firstElementChild.href, name, children: []};
			}
		}
		if (item.tagName === 'a' || item.tagName === 'A') {
			var name = item.innerText;
			var path = item.href;
			var logo = null;

			if(item.firstElementChild && (item.firstElementChild.tagName === 'IMG' || item.firstElementChild.tagName === 'img')) {
				logo = item.firstElementChild.src;
			}

			data[currentParent].children.push({name, path, logo});
		}
	}
	return Object.values(data);
}