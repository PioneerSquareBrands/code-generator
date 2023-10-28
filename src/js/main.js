console.log("PSB 2D Code Gnerator Start");

// Bulk Generator
let listInput = document.querySelector('.bulk-generator input');

window.onload = function () {
  lister();
};

listInput.addEventListener('input', function() {
  lister();
});

function lister() {
  let inputVal = listInput.value;
  let inputArr = inputVal.split(/,\s*/);
  let generatorTable = document.querySelector('.generator-table');

  generatorTable.innerHTML = '';

  inputArr.forEach(value => {
    if(value != ''){
      let item = document.createElement('div');
    
      // Make the item div
      item.classList.add('generator-item');

      // Identify the Brand
      let itemBrand = identifyBrand(value);
      item.classList.add('brand--' + itemBrand.toLowerCase().replace(' ', '-'));

      // Identify the URL
      let itemURL;

      if(itemBrand == 'Brenthaven') {
        itemURL = 'https://brenthaven.com/' + value;
      } else if (itemBrand == 'Gumdrop Cases') {
        itemURL = 'https://www.gumdropcases.com/' + value;
      } else {
        itemURL = 'Invalid URL. Please check the value.';
      }

      // Insert the item content
      item.innerHTML = `
        <div class="generator-item__value">${value}</div>
        <div class="generator-item__brand"><span>${itemBrand}</span></div>
        <div class="generator-item__url">${itemURL}</div>
        <div class="generator-item__datamatrix generator-item__code"><a href="#" data-type="datamatrix" data-sku="${value}"></a></div>
        <div class="generator-item__qrcode generator-item__code"><a href="#" data-type="qrcode" data-sku="${value}"></a></div>
      `;

      // Check if URL is invalid, otherwise generate datamatrix/qr code
      if (!itemURL.includes('Invalid URL')){
        let dataMatrix = DATAMatrix({
          msg: itemURL,
          dim: 2000,
          pad: 1
        });

        let qrCode = QRCode({
          msg: itemURL,
          dim: 2000,
          pad: 1
        });
        item.querySelector('.generator-item__datamatrix a').replaceChildren();
        item.querySelector('.generator-item__datamatrix a').appendChild(dataMatrix);
        item.querySelector('.generator-item__qrcode a').replaceChildren();
        item.querySelector('.generator-item__qrcode a').appendChild(qrCode);
      } else {
        item.querySelector('.generator-item__datamatrix').innerHTML += '<div class="empty-code"></div>';
        item.querySelector('.generator-item__qrcode').innerHTML += '<div class="empty-code"></div>';
      }

      generatorTable.appendChild(item);
    }
  });

  buttonDownload();
}

function identifyBrand(sku) {
  let brand;
  if (/^\d{4}(?:$|\d{3}$)/.test(sku)) {
    brand = 'Brenthaven';
  } else if (/\b\d{2}[A-Za-z]\d{3}(?:$|[EC]\d{2}[-]\d(?:$|\d$))/.test(sku)) {
    brand = 'Gumdrop Cases';
  } else {
    brand = 'Invalid SKU'
  }
  return brand;
}

function buttonDownload(){
  document.querySelectorAll('.generator-item__code a').forEach(function(b) {
    b.addEventListener('click', function(e) {
      e.preventDefault();

      let button = e.target;
      let name = button.dataset.sku;
      let type = button.dataset.type;
      
      let svg = new XMLSerializer().serializeToString(button.querySelector('svg'));

      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      canvg(canvas, svg);

      let dataURL = canvas.toDataURL('image/png');

      let a = document.createElement('a');
      a.href = dataURL;
      a.download = name + '-' + type + '.png';
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
}