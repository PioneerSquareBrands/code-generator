console.log("PSB 2D Code Gnerator Start");

let partNumber = document.querySelector('#partNumber');
let qrContainer = document.querySelector('.code-placeholder.qr-code');
let dataMatrixContainer = document.querySelector('.code-placeholder.data-matrix');
let downloadButtons = document.querySelectorAll('.generate-button');

window.onload = function () {
  generator(partNumber.value);
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
  console.log(finalURL);

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