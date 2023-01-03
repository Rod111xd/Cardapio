const path = require('path');
const fs = require('fs');
const sharp = require("sharp");

const itemsPath = path.join(__dirname, '../items');
const imagesPath = path.join(__dirname, '../');

const daysWeek = ['DOMINGO','SEGUNDA','TERÇA','QUARTA','QUINTA','SEXTA','SÁBADO'];

const anchors_8 = [
                    [0, 0.442, 0.237, 0.187, "12.5%", "68%", "70%", "72%"],
                    [0.253, 0.442, 0.237, 0.187, "37.5%", "68%", "70%", "72%"],
                    [0.508, 0.442, 0.237, 0.187, "62.5%", "68%", "70%", "72%"],
                    [0.763, 0.442, 0.237, 0.187, "87.5%", "68%", "70%", "72%"],
                    [0, 0.721, 0.237, 0.187, "12.5%", "96%", "98%", "100%"],
                    [0.253, 0.721, 0.237, 0.187, "37.5%", "96%", "98%", "100%"],
                    [0.508, 0.721, 0.237, 0.187, "62.5%", "96%", "98%", "100%"],
                    [0.763, 0.721, 0.237, 0.187, "87.5%", "96%", "98%", "100%"]
                ];

const anchors_9 = [
                    [0, 0.442, 0.237, 0.187, "12.5%", "68%", "70%", "72%"],
                    [0.253, 0.442, 0.237, 0.187, "37.5%", "68%", "70%", "72%"],
                    [0.508, 0.442, 0.237, 0.187, "62.5%", "68%", "70%", "72%"],
                    [0.763, 0.442, 0.237, 0.187, "87.5%", "68%", "70%", "72%"],

                    [0, 0.737, 0.187, 0.179, "10%", "96%", "98%", "100%"],
                    [0.203, 0.737, 0.187, 0.179, "30%", "96%", "98%", "100%"],
                    [0.406, 0.737, 0.187, 0.179, "50%", "96%", "98%", "100%"],
                    [0.61, 0.737, 0.187, 0.179, "70%", "96%", "98%", "100%"],
                    [0.813, 0.737, 0.187, 0.179, "90%", "96%", "98%", "100%"]
                ];

const MAX_CHARS_8 = 15;
const MAX_CHARS_9 = 13;

const getItems = () => {

    var items = [];
    var name_items = fs.readdirSync(itemsPath);

    name_items.forEach((file, index) => {
        items.push({id: index, name: file.replace(/\.[^/.]+$/, "")})
    });

    return items;

}

const getImages = (items) => {

    items.forEach((item, index) => {
        console.log(itemsPath+"/"+item.name+".png")
        items[index].image = sharp(itemsPath+"/"+item.name+".png")
    });

    return items;
}

const breakNameLines = (name, n_items) => {

    var max_chars_name = ((n_items==8) ? MAX_CHARS_8 : MAX_CHARS_9);
    var final_name = "";
    var current_line = "";
    var words = name.split(" ");

    words.forEach((word) => {
        var new_line = current_line+" "+word;
        if (new_line.length <= max_chars_name) {
            final_name += " "+word;
            current_line += " "+word;
        }else {
            final_name += "\n"+word;
            current_line = word;
        }
        
    });

    return final_name.split("\n");
}

const formatDate = (nmb) => {
    if (nmb < 10) {
        return "0" + nmb.toString();
    }else {
        return nmb.toString();
    }
}

const produceMenu = async (items) => {

    const n_items = items.length;

    var menu;

    if (n_items == 8) {
        var menu = sharp(imagesPath+"BackgroundOito.png");
    }else if (n_items == 9) {
        var menu = sharp(imagesPath+"BackgroundNove.png");
    }

    const metadata = await menu.metadata();

    const width = metadata.width;
    const height = metadata.height;

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth()+1;

    const dayText = formatDate(day) + "/" + formatDate(month);
    const weekDay = daysWeek[date.getDay()];

    var textSvg = `
    <svg width="${width}" height="${height}">
      <style>
      .weekDay { font-family: arial black, sans-serif ; fill: #1F414A; font-size: 114px; font-weight: bold;}
      .dayText { font-family: arial black, sans-serif ; fill: #1F414A; font-size: 174px; font-weight: bold;}
      .weekDayBack { font-family: arial black, sans-serif ; fill: #9C2425; font-size: 114px; font-weight: bold;}
      .dayTextBack { font-family: arial black, sans-serif ; fill: #9C2425; font-size: 174px; font-weight: bold;}
      .itemName { font-family: arial black, sans-serif ; fill: #1F414A; font-size: 25px; font-weight: bold; text-align: center; }
      </style>
      <text x="70.5%" y="12.5%" text-anchor="middle" class="weekDayBack">${weekDay}</text>
      <text x="70.5%" y="25.5%" text-anchor="middle" class="dayTextBack">${dayText}</text>
      <text x="70%" y="12%" text-anchor="middle" class="weekDay">${weekDay}</text>
      <text x="70%" y="25%" text-anchor="middle" class="dayText">${dayText}</text>
    `;

    // Adicionar imagens e novos textos

    var composites = [];

    items.forEach(async (item, index) => {

        var itemName = breakNameLines(item.name.toUpperCase(), n_items);

        if (n_items == 8) {
            
            composites.push(
                {
                  input: await item.image.resize({
                    width: Math.ceil(anchors_8[index][2] * width),
                    height: Math.ceil(anchors_8[index][3] * height)
                  }).toBuffer(),
                  top: Math.ceil(anchors_8[index][1] * height),
                  left: Math.ceil(anchors_8[index][0] * width)
                }
            );
            
            if (item.name != "Vazio") {
                
                itemName.forEach((line, index_line) => {
                    if (index_line==0) {
                        textSvg += `
                            <text x="${anchors_8[index][4]}" y="${anchors_8[index][5]}" text-anchor="middle" class="itemName">${line}</text>
                        `;
                    }else if (index_line==1){
                        textSvg += `
                            <text x="${anchors_8[index][4]}" y="${anchors_8[index][6]}" text-anchor="middle" class="itemName">${line}</text>
                        `;
                    }else {
                        textSvg += `
                            <text x="${anchors_8[index][4]}" y="${anchors_8[index][7]}" text-anchor="middle" class="itemName">${line}</text>
                        `;
                    }
                });
            }

        }else {

            composites.push(
                {
                  input: await item.image.resize({
                    width: Math.ceil(anchors_9[index][2] * width),
                    height: Math.ceil(anchors_9[index][3] * height)
                  }).toBuffer(),
                  top: Math.ceil(anchors_9[index][1] * height),
                  left: Math.ceil(anchors_9[index][0] * width)
                }
            );

            if (item.name != "Vazio") {
                
                itemName.forEach((line, index_line) => {
                    if (index_line==0) {
                        textSvg += `
                            <text x="${anchors_9[index][4]}" y="${anchors_9[index][5]}" text-anchor="middle" class="itemName">${line}</text>
                        `;
                    }else if(index_line==1) {
                        textSvg += `
                            <text x="${anchors_9[index][4]}" y="${anchors_9[index][6]}" text-anchor="middle" class="itemName">${line}</text>
                        `;
                    }else {
                        textSvg += `
                            <text x="${anchors_9[index][4]}" y="${anchors_9[index][7]}" text-anchor="middle" class="itemName">${line}</text>
                        `;
                    }
                });
            }

        }

    });

    while(composites.length != n_items) {
        await new Promise(r => setTimeout(r, 400));
    }

    textSvg += '</svg>';

    const svgBuffer = Buffer.from(textSvg);

    composites.push({
        input: svgBuffer,
        top: 0,
        left: 0,
    });

    menu = menu.composite(composites);

    return menu.toBuffer();

}

const fetchItems = (req, res) => {

    var items = getItems();

    return res.status(200).json({items: items}); 
    
};

const makeMenu = async (req, res) => {

    const id_items = req.body.items;

    if (id_items.length < 8 || id_items.length > 9) {
        return res.status(400).json({message: "Número de itens incorreto"});
    }

    var items_original = getItems();

    var pan_carneiro = items_original.filter(function(item)
    {
        return item.name == "Panelada" || item.name == "Carneiro Cozido";
    });

    var items = items_original.filter(function(item)
    {
        return id_items.includes(item.id) && item.name != "Panelada" && item.name != "Carneiro Cozido";
    });

    items = pan_carneiro.concat(items);

    while(items.length < 8) {
        items.push({id: 73, name: 'Vazio'});
    }

    items = getImages(items);

    var final_menu = await produceMenu(items);

    const img = Buffer.from(final_menu, 'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });

    return res.end(img); 
    
    //return res.status(200).json({message: "", menu: final_menu});

}

module.exports = { fetchItems, makeMenu }
