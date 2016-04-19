const readLine = require('readline');
const fs = require('fs');

const rlp = readLine.createInterface({
    input: fs.createReadStream('products.txt')
});

const rll = readLine.createInterface({
    input: fs.createReadStream('listings.txt')
});

var products = [];
var listings = [];

rlp.on('line', line => {
    products.push(JSON.parse(line));
});

rll.on('line', line => {
    listings.push(JSON.parse(line));
});

rlp.on('pause', () => {
    rll.on('pause', () => {
        var outFile = fs.createWriteStream('result.txt');
        
        for(var i = 0; i < products.length; i++) {
            var man = products[i].manufacturer;
            var model = products[i].model;
            var tmpList = [];

            listings.forEach((item, index, arr) => {
                if(item.manufacturer.toLowerCase() === man.toLowerCase()) {
                    if(item.title.toLowerCase().includes(model.toLowerCase())) {
                        tmpList.push(item);
//                        arr.splice(index, 1);
                    }
                }
            });

            /* The result objects must be like the following:
             * {
             * "product_name": String
             * "listings": Array[Listing]
             * }
             */
            var obj = {
                'product_name': products[i]['product_name'],
                'listings': tmpList
            };
            
            outFile.write(JSON.stringify(obj) + '\n');
        }
        
        outFile.end();
        outFile.on('finish', () => {
            console.log('All done!');
        });
    });
});