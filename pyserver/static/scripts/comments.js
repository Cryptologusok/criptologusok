


function write_comments(data){
    data = data.replaceAll("&#34;",'"')
    data = JSON.parse(data);


    let daString = "";
    for(let i=0;i<data.length;i++){

        daString += '<div class="comment">';
        daString += '<div class="title">' + data[i][0] + '</div>';
        daString += '<div class="detail_container">';

        daString += '<div class="description">' + data[i][1] + '</div>';
        daString += '<div class="variables">';
        daString += '<div class="variable">Start Date: '+ data[i][2]+'</div>';
        daString += '<div class="variable">End Date: '+ data[i][3]+'</div>';
        daString += '<div class="variable">x: '+ data[i][4]+'</div>';

        for(j=0;j<data[i][5].length;j++){
            daString += '<div class="variable">y'+j+": "+ data[i][5][j]+'</div>';
        }

        daString += '</div>';
        daString += '</div>';
        daString += '</div>';
    }
    document.getElementById("comments").innerHTML += daString;
}


