'use strict'
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
        let outFile = fs.createWriteStream('result.txt');
        
        for(let i = 0; i < products.length; i++) {
            let man = products[i]['manufacturer'];
            let model = products[i]['model'];
            let tmpList = [];

            listings.forEach((item, index, arr) => {
                if(item['manufacturer'].toLowerCase() === man.toLowerCase()) {
                    let title = item['title'].toLowerCase();
                    let pos = title.indexOf(model.toLowerCase());

                    if (pos !== -1) {
                        if (title.charAt(pos + model.length).match(/[\s\-\._!,A-z]/) && !title.charAt(pos - 1).match(/\d|\w/)) {
                            tmpList.push(item);
                            arr.splice(index, 1);
                        }
                    }
                }
            });

            /* The result objects must be like the following:
             * {
             * "product_name": String
             * "listings": Array[Listing]
             * }
             */
            let obj = {
                'product_name': products[i]['product_name'],
                'listings': tmpList
            };
            
            if (obj.listings.length > 0) {
                outFile.write(JSON.stringify(obj) + '\n');
            }
        }
        
        outFile.end();
        outFile.on('finish', () => {
            console.log('All done!');
        });
    });
});