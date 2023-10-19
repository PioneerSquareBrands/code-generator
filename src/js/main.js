console.log("PSB 2D Code Gnerator Start");

let partNumber = document.querySelector('#partNumber');
let qrContainer = document.querySelector('.code-placeholder.qr-code');
let dataMatrixContainer = document.querySelector('.code-placeholder.data-matrix');
let downloadButtons = document.querySelectorAll('.generate-button');

window.onload = function () {
  generator(partNumber.value);
  lister();
};

partNumber.addEventListener('input', function() {
  if (partNumber.value) {
    generator(partNumber.value);
  }
});

document.querySelector('form').addEventListener('change', function (event) {
  generator(partNumber.value);
})

downloadButtons.forEach(function(b) {
  b.addEventListener('click', function(e) {
    let button = e.target;
    let name = button.dataset.name;
    let type = button.dataset.type;
    
    download(button, name, type);
  });
});


function generator(val) {
  let url = document.querySelector('input[name="website"]:checked').value;
  let finalURL = url + '/' + val;

  let dataMatrix = DATAMatrix({
    msg: finalURL,
    dim: 2000,
    pad: 1
  });

  let qrCode = QRCode({
    msg: finalURL,
    dim: 2000,
    pad: 1
  });

  dataMatrixContainer.replaceChildren();
  dataMatrixContainer.appendChild(dataMatrix);
  qrContainer.replaceChildren();
  qrContainer.appendChild(qrCode);

  document.querySelectorAll('.generate-button').forEach((b) => {
    b.classList.add('shown');
    b.dataset.name = val;
  });
}

function download(button, name, type){
   var svg = new XMLSerializer().serializeToString(document.querySelector('.code-placeholder.' + type + ' svg'));

   var canvas = document.createElement('canvas');
   var ctx = canvas.getContext('2d');

   canvg(canvas, svg);

   var dataURL = canvas.toDataURL('image/png');

   var a = document.createElement('a');
   a.href = dataURL;
   a.download = name + '-' + type + '.png';
   a.style.display = 'none';
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
}

// Bulk Generator
let listInput = document.querySelector('.bulk-generator input');

listInput.addEventListener('input', function() {
  lister();
});

function lister() {
  let inputVal = listInput.value;
  let inputArr = inputVal.split(/,\s*/);
  let generatorTable = document.querySelector('.generator-table');

  if (inputVal){
    generatorTable.innerHTML = '';

    inputArr.forEach(value => {
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
        itemURL = 'Invalid URL';
      }

      // Insert the item content
      item.innerHTML = `
        <div class="generator-item__value">${value}</div>
        <div class="generator-item__brand"><span>${itemBrand}</span></div>
        <div class="generator-item__url">${itemURL}</div>
        <div class="generator-item__code"></div>
      `;

      console.log(itemURL);
      if (itemURL != 'Invalid URL'){
        let dataMatrix = DATAMatrix({
          msg: itemURL,
          dim: 2000,
          pad: 1
        });
        item.querySelector('.generator-item__code').replaceChildren();
        item.querySelector('.generator-item__code').appendChild(dataMatrix);
      } else {
        item.querySelector('.generator-item__code').innerHTML += '<div class="empty-code"></div>';
      }

      generatorTable.appendChild(item);
    });
  }
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