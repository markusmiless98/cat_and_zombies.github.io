const button_left = document.getElementById("button_left")
const button_right = document.getElementById("button_right")
const button_up = document.getElementById("button_up")
const button_down = document.getElementById("button_down")
const txt_pos = document.getElementById("position_txt")
txt_pos.value = 12;
var zomb_countdown = 5;
var zomb_speed = 6;

function GoLeft(){
    MoveDirection(-1);
}
function GoUp(){
    MoveDirection(-5);
}
function GoRight(){
    MoveDirection(1);
}
function GoDown(){
    MoveDirection(5);
}

function MoveDirection(direction){
    UpdatePosition(direction)
    SetBackgroundEl();
    CheckAvailableDirection();
    setTimeout(() => {
        UpdateZombiePos();
    }, 25);
    setTimeout(() => {
        HearZombies();
    }, 75);
    setTimeout(() => {
        CheckZombies();
    }, 100);
}

function CheckAvailableDirection(){
    let cur_pos = txt_pos.value
    if (game_won || game_lost)
    {
        return;
    }
    if (cur_pos % 5 <= 0 || cur_pos <= 0)
    {
        button_left.disabled = true;
    }
    else
    {
        button_left.disabled = false;
    }
    if ((cur_pos + 1) % 5 <= 0)
    {
        button_right.disabled = true;
    }
    else
    {
        button_right.disabled = false;
    }
    if (cur_pos < 5)
    {
        button_up.disabled = true;
    }
    else
    {
        button_up.disabled = false;
    }
    if (cur_pos > 19)
    {
        button_down.disabled = true;
    }
    else
    {
        button_down.disabled = false;
    }
}

function UpdatePosition(position){
    let position_old = document.getElementById("pos_" + txt_pos.value)
    UpdateText(position_old,false);
    txt_pos.value += position;
    txt_pos.innerHTML = "here is position: " + txt_pos.value;

    let position_new = document.getElementById("pos_" + txt_pos.value)
    UpdateText(position_new,true);
}
function UpdateText(_loc, player_is_on){
    let get_num = txt_pos.value;
    UpdateIfCat(false);
    if (player_is_on){
        if (GetZombierOrCat() == "Cat")
        {
            _loc.innerText = "(You)\n";
            _loc.innerText += GetPositionTxt(get_num)
            _loc.innerText +="\n!Cat!";   
            _loc.className="position"
            UpdateIfCat(true);
            positions[get_num].innerText="Cat Found"
            num_cats--;
            if (num_cats <= 0)
            {
                WinGame();
            }
        }
        else if (GetZombierOrCat() == "Zombie")
        {
            _loc.innerText = "(Corpse)\n";
            _loc.innerText += GetPositionTxt(get_num)
            _loc.innerText += "! Zombie !\n";
            _loc.className="zombie"
            LoseGame();
        }
        else
        {
            _loc.innerText = "(You)\n";
            _loc.innerText += GetPositionTxt(get_num)
            _loc.innerText +="\nSafe";   
            _loc.className="position"
        }
    }
    else
    {
        if (GetZombierOrCat() == "Cat")
        {
            _loc.innerText = "Cat Here!\n";
            _loc.className="cat"
        }
        else if (GetZombierOrCat() == "Cat Found")
        {
            _loc.innerText = "Cat Found Here!";
            _loc.className="cat"
        }
        else
        {
            _loc.innerText = "(Visited)\n";
            _loc.className="marked"
        }
        _loc.innerText += "\n" + GetPositionTxt(get_num)
        _loc.innerText +="\n???";
    }
}
function GetPositionTxt(_number){
    let result = "";
    let i = _number;
    let res = 10;
    
    while(i % 5 && res > 0){
        i--;
    }
    i = i / 5;
    result += i + ",";
    
    i = _number;
    while(i >= 5 && res > 0)
    {
        i -= 5;
    }
    result += i;

    return result;
}

button_left.addEventListener("click",GoLeft)
button_right.addEventListener("click",GoRight)
button_up.addEventListener("click",GoUp)
button_down.addEventListener("click",GoDown)

CheckAvailableDirection();

const root = document.documentElement;

function SetBackgroundEl(){
    var rs = getComputedStyle(root);
    let cur_pos = txt_pos.value
    root.style.setProperty('--bg-of-forest',SetTextForPic('pic_forest_' + cur_pos));
}

function SetTextForPic(txt_img){
    return 'url("pics/' + txt_img + '.jpg")'
}

function GetZombierOrCat(){
    let cur_pos = txt_pos.value
    if (zomb_positions[cur_pos].innerText == "Zombie")
    {
        return "Zombie"
    }
    else if (positions[cur_pos].innerText == "Cat")
    {
        return "Cat"
    }
    return "";
}

function UpdateZombiePos()
{
    let i = 0;
    let zomb_list = zomb_positions
    if (zomb_countdown > 0){
        zomb_countdown--;
    }
    else
    {
        zomb_countdown += zomb_speed
        if (zomb_speed > 2)
        {
            zomb_speed--;
        }
        //alert("Zombies are moving!")
        zomb_positions.forEach(_pos => {
            if (zomb_positions[i].innerText == "Zombie")
            {
                let temp_i = i + FindZombieDirection(i);
                if (zomb_positions[temp_i].innerText != "Zombie")
                {
                    zomb_positions[temp_i].innerText = "Zombie";
                    _pos.innerText = "X";
                }
            }
            i++;
        });
    }
}

function HearZombies(){
    let i = 0;
    let cur_pos = txt_pos.value
    let is_west = false;
    let is_east = false;
    let is_north = false;
    let is_northwest = false;
    let is_northeast = false;
    let is_south = false;
    let is_southwest = false;
    let is_southeast = false;
    let _same = false
    let encounter = false;
    let direc_amnt = 0;
    zomb_positions.forEach(element => {
        if (element.innerText == "Zombie")
        {
            if (zomb_countdown > 2)
            {
                if (cur_pos - 5 == i && !is_north)
                {
                    is_north = true;
                    direc_amnt++;
                }
                if (cur_pos + 5 == i && !is_south)
                {
                    is_south = true;
                    direc_amnt++;
                }
                if (cur_pos - 1 == i && cur_pos % 5 != 0 && !is_west)
                {
                    is_west = true;
                    direc_amnt++;
                }
                if (cur_pos + 1 == i && (cur_pos + 1) % 5 != 0 && !is_west)
                {
                    is_east = true;
                    direc_amnt++;
                }
            }
            else
            {
                if ((cur_pos - 5 == i || cur_pos - 10 == i) && !is_north)
                {
                    console.log("N")
                    is_north = true;
                    direc_amnt++;
                }
                if ((cur_pos + 5 == i || cur_pos + 10 == i) && !is_south)
                {
                    console.log("S")
                    is_south = true;
                    direc_amnt++;
                }
                if (!is_west)
                {
                    if (cur_pos - 1 == i && cur_pos % 5 != 0)
                    {
                        console.log("W")
                        is_west = true;
                        direc_amnt++;
                    }
                    else if (cur_pos - 2 == i && ((cur_pos - 1) % 5 != 0 || cur_pos % 5 != 0))
                    {
                        is_west = true;
                        direc_amnt++;
                    }
                }
                if (!is_east)
                {
                    if (cur_pos + 1 == i && (cur_pos + 1) % 5 != 0)
                    {
                        is_east = true;
                        direc_amnt++;
                    }
                    else if (cur_pos + 2 == i && ((i + 1) % 5 != 0 || (cur_pos + 2) % 5 != 0))
                    {
                        is_east = true;
                        direc_amnt++;
                    }
                }
                if (cur_pos % 5 != 0)
                {
                    if (cur_pos - 6 == i && !is_northwest)
                    {
                        is_northwest = true;
                        direc_amnt++;
                    }
                    if (cur_pos + 4 == i && !is_southwest)
                    {
                        is_southwest = true;
                        direc_amnt++;
                    }
                }
                if ((cur_pos + 1) % 5 != 0)
                {
                    if (cur_pos - 4 == i && !is_northeast)
                    {
                        is_northeast = true;
                        direc_amnt++;
                    }
                    if (cur_pos + 6 == i && !is_southeast)
                    {
                        is_southeast = true;
                        direc_amnt++;
                    }
                }
            }
            if (!_same && cur_pos == i)
            {
                _same = true;
            }
        }
        i++;
    });
    if (direc_amnt > 0)
    {
        encounter = true; 
    }
    let str = "";
    if (is_east)
    {
        str += "East";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
        else if (direc_amnt == 1){
            str+= " & ";
        }
    }
    if (is_west)
    {
        str += "West";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
        else if (direc_amnt == 1){
            str+= " & ";
        }
    }
    if (is_north)
    {
        str += "North";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
        else if (direc_amnt == 1){
            str+= " & ";
        }
    }
    if (is_northeast)
    {
        str += "NorthEast";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
        else if (direc_amnt == 1){
            str+= " & ";
        }
    }
    if (is_northwest)
    {
        str += "NorthWest";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
        else if (direc_amnt == 1){
            str+= " & ";
        }
    }
    if (is_south)
    {
        str += "South";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
        else if (direc_amnt == 1){
            str+= " & ";
        }
    }
    if (is_southwest)
    {
        str += "SouthWest";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
        else if (direc_amnt == 1){
            str+= " & ";
        }
    }
    if (is_southeast)
    {
        str += "SouthEast";
        direc_amnt--;
        if (direc_amnt >= 2){
            str+= ", ";
        }
    }
    if (!encounter)
    {
        str = " the forest somewhere."
    }
    else
    {
        str += "!"
    }
    if (zomb_countdown == 0)
    {
        str += "\nZombies are about to move."
    }
    if (_same)
    {
        str += "\nThere is a Zombie near you."
    }
    document.getElementById("info_text").innerText = "You heard a zombie in " + str;
}

function GetDistance(_locA,_locB ,_is_row)
{
    return Math.abs(GetNumByRowColumn(_locB,_is_row) - GetNumByRowColumn(_locA,_is_row))
}
function GetNumByRowColumn(num, row_or_col){
    let i = num;
    let res = 10;
    
    if (row_or_col === true){
        while(i % 5 && res > 0)
        {
            i--;
        }
        i = i / 5;

    }
    else
    {
        while(i >= 5 && res > 0)
        {
            i -= 5;
        }
    }

    return i;
}

function FindZombieDirection(_location){
    let vertical_weight = 0;
    let horizontal_weight = 0;
    let cur_pos = txt_pos.value;
    let distance = cur_pos - _location

    if (distance > 0 && distance < 5)
    {
        horizontal_weight++;
    }
    if (distance < 0 && distance > -5)
    {
        horizontal_weight--;
    }
    if (distance < -5){
        vertical_weight--;
    }
    if (distance > 5){
        vertical_weight++;
    }

    if (_location > 19)
    {
        if (cur_pos > _location)
        {
            horizontal_weight++;
        }
        else if (cur_pos < _location)
        {
            horizontal_weight--;
        }
        if (cur_pos <= 19)
        {
            vertical_weight--;
        }
    }
    else if (_location < 5)
    {
        if (cur_pos > _location)
        {
            horizontal_weight++;
        }
        else if (cur_pos < _location)
        {
            horizontal_weight--;
        }
        if (cur_pos >= 5)
        {
            vertical_weight++;
        }
    }
    if (_location % 5 == 0)
    {
        if (cur_pos < _location)
        {
            vertical_weight--;
        }
        if (horizontal_weight < 0)
        {
            horizontal_weight = 0;
        }
    }
    else if ((_location + 1) % 5 <= 0)
    {
        if (cur_pos > _location)
        {
            vertical_weight++;
        }
        if (horizontal_weight > 0)
        {
            horizontal_weight = 0;
        }
    }

    if (cur_pos % 5 == _location % 5)
    {
        vertical_weight *= 0.5;
    }

    if (horizontal_weight >= 1)
    {
        return 1;
    }
    else if (horizontal_weight <= -1)
    {
        return -1;
    }
    if (vertical_weight >= 1)
    {
        return 5;
    }
    else if (vertical_weight <= -1)
    {
        return -5;
    }

    return 0;
}

function WinGame()
{
    game_won = true;
    DisableButtons();

    alert("You found all the cats!\nRefresh to restart!")
}

function LoseGame()
{
    game_lost = true;
    DisableButtons();
}

function DisableButtons()
{
    button_right.disabled = true;
    button_left.disabled = true;
    button_up.disabled = true;
    button_down.disabled = true;

}

async function CheckZombies()
{
    let zomb_list = zomb_positions
    let i = 0;
    zomb_list.forEach(element => {
        let el = document.getElementById("pos_" + i);
        if (element.innerText == "Zombie"){
            el.className="temp_mark"
        }
        else
        {
            el.className=""
        }
        i++;
    });
}

txt_pos.onchange = SetBackgroundEl()