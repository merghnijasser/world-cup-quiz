const sharp = require('sharp');
const fs = require('fs');


const sizes = [
72,
96,
128,
144,
152,
192,
384,
512
];


const input = 'resources/app-icon.png';


if(!fs.existsSync('public/icons')){
    fs.mkdirSync('public/icons',{
        recursive:true
    });
}


sizes.forEach(size=>{


sharp(input)
.resize(size,size)
.png()
.toFile(
`public/icons/icon-${size}x${size}.png`
)
.then(()=>{

console.log(
`Created icon-${size}x${size}.png`
);

});


});