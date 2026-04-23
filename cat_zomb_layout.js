
const block_par = document.getElementById("layout")

function SetUpBlock(size){
    let i = 0;
    let num = 5*size;
    if (num < 25){
        num = 25;
    }

    while(i < num){
        AddBlock(block_par,i);
        i++;
    }
    let doc = document.getElementById("text_temp")

    // Assign stuff
    
    i = 0;

    for (var img_new of positions){
        let div_tar = document.getElementById("pos_" + i)
        var str = ""
        if (i == 12){
            str = "Start";
        }
        else
        {
            str = AssignCatOrZombie(0,num,i);
        }
        img_new.innerText = str;
        AddLocationText(div_tar,i);
        i++;
    }
    i = 0;
    let res = 100;
    while (i < positions.length && res > 0)
    {
        let new_pos = {};
        new_pos.value = i;
        new_pos.innerText = "X";
        if (positions[i].innerText == "X" || positions[i].innerText == "Start")
        {
            cat_positions.push(new_pos);
            zomb_positions.push(new_pos);
        }
        if (positions[i].innerText == "Zombie")
        {
            cat_positions.push(new_pos);
            let zomb_pos = {};
            zomb_pos.value = i;
            zomb_pos.innerText = "Zombie";
            zomb_positions.push(zomb_pos);
        }
        if (positions[i].innerText == "Cat")
        {
            let cat_pos = {};
            cat_pos.value = i;
            cat_pos.innerText = "Cat";
            cat_positions.push(cat_pos);
            zomb_positions.push(new_pos);
        }
        i++;
        res--;
    }
}

function AddLocationText(target, location){
    let txt_pos = document.getElementById("position_txt")
    if (location == 12)
    {
        target.innerText = "(You)\n"
    }
    else
    {
        target.innerText = "\n"
    }
    if (location % 5 <= 0){
        target.innerText += GetNumByRowColumn(location,true)
        target.innerText += ","
        target.innerText += GetNumByRowColumn(location,false)
    }
    else{
        target.innerText += GetNumByRowColumn(location,true)
        target.innerText += ","
        target.innerText += GetNumByRowColumn(location,false)
    }
    if (location == 12)
    {
        target.innerText += "\nSafe"
    }
    else
    {
        target.innerText += "\n???"
    }
}

function GetTargetLocation(target, location){
    if (location % 5 <= 0){
        target.innerText += GetNumByRowColumn(location,true)
        target.innerText += ","
        target.innerText += GetNumByRowColumn(location,false)
    }
    else{
        target.innerText += GetNumByRowColumn(location,true)
        target.innerText += ","
        target.innerText += GetNumByRowColumn(location,false)
    }
}

function AddBlock(par, num){
    var new_div = document.createElement("div");
    new_div.id = "pos_" + num;
    new_div.innerText = "[_O_]";
    if (num == 12){
        new_div.className="position"
    }
    var new_pos = {};
    new_pos.value = num;
    new_pos.innerText = "Empty";
    positions.push(new_pos);
    block_par.appendChild(new_div);
}

function AssignCatOrZombie(min_square, max_square,adjustment){
    let i = getRandomInt(min_square,max_square);

    if (num_zombies < 1 && adjustment > Math.round(20 - num_cats * 0.1)){
        num_zombies++;
        return "Zombie";
    }
    
    if (i >= 15 - Math.round(0.2 * adjustment))
    {
        let score = 11;
        let zomb_mod = 1 + Math.round(num_zombies * 0.5);
        score += num_cats * 1.25;
        score -= num_zombies;
        score += adjustment * 0.1;
        if (adjustment == 13 || adjustment == 11 || adjustment == 7 || adjustment == 17)
        {
            // Discourage Zombies being right next to you
            zomb_mod -= 3;
        }
        score = Math.round(score)
        if (i > score){
            num_cats = num_cats + 1;
            return "Cat"
        }
        else if (num_zombies < Math.round(num_cats * 0.25 + zomb_mod)) {
            num_zombies = num_zombies + 1;
            return "Zombie"
        }
    }

    return "X";
}

function GetNumByRowColumn(num, row_or_col){
    let i = num;
    let res = 10;
    
    if (row_or_col === true){
        while(i % 5 && res > 0){
            i--;
        }
        i = i / 5;
    }
    else{
        while(i >= 5 && res > 0)
        {
            i -= 5;
        }
    }

    return i;
}

SetUpBlock(5);
